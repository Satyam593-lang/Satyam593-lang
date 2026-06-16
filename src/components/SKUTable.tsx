import React, { useState } from "react";
import { SKUItem, StockStatus, UserSession } from "../types";
import { Search, Filter, Edit3, HelpCircle, ArrowDownToLine, ArrowUpToLine, ShieldAlert, Check, X, FileSpreadsheet } from "lucide-react";
import { CSV_TEMPLATE, parseCSVData } from "../utils";

interface SKUTableProps {
  items: SKUItem[];
  onUpdateSKU: (skuId: string, updatedFields: Partial<SKUItem>) => void;
  onBulkImport: (importedItems: SKUItem[]) => void;
  session: UserSession;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  isDarkMode?: boolean;
}

export default function SKUTable({
  items,
  onUpdateSKU,
  onBulkImport,
  session,
  selectedItemId,
  onSelectItem,
  isDarkMode = true
}: SKUTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{
    currentStock: string;
    price: string;
    leadTime: string;
    setupCost: string;
  }>({
    currentStock: "",
    price: "",
    leadTime: "",
    setupCost: ""
  });

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const triggerCSVTemplateDownload = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "logicast_supply_chain_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const parsed = parseCSVData(text);
          if (parsed.length > 0) {
            onBulkImport(parsed);
          } else {
            alert("No valid rows were detected in this CSV. Please reference the template.");
          }
        } catch (error) {
          console.error("CSV import crash:", error);
          alert("Error parsing CSV. Please verify column formatting conforms to the template.");
        }
      }
    };
    reader.readAsText(file);
  };

  const startEditing = (item: SKUItem) => {
    setEditingId(item.id);
    setEditFields({
      currentStock: item.currentStock.toString(),
      price: item.price.toString(),
      leadTime: item.leadTime.toString(),
      setupCost: item.setupCost.toString()
    });
  };

  const saveEditing = (id: string) => {
    const updatedStock = parseInt(editFields.currentStock, 10);
    const updatedPrice = parseFloat(editFields.price);
    const updatedLeadTime = parseInt(editFields.leadTime, 10);
    const updatedSetupCost = parseFloat(editFields.setupCost);

    onUpdateSKU(id, {
      currentStock: isNaN(updatedStock) ? 0 : updatedStock,
      price: isNaN(updatedPrice) ? 1.0 : updatedPrice,
      leadTime: isNaN(updatedLeadTime) ? 1 : updatedLeadTime,
      setupCost: isNaN(updatedSetupCost) ? 0.1 : updatedSetupCost
    });

    setEditingId(null);
  };

  const canEditPricesAndLeadTime = session.role === "Director" || session.role === "Planner";
  const canEditStockQtyValue = session.role === "Director" || session.role === "Logistics";
  const canImportBulkFiles = session.role === "Director" || session.role === "Planner";

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 relative z-10 ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {/* Table Bar Header / Import Panel */}
      <div className={`p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        isDarkMode ? "border-white/10" : "border-slate-200"
      }`}>
        <div>
          <h3 className={`text-base font-semibold tracking-tight font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Active SKU Catalog & Parameters
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyze safety triggers, order bounds, and modify individual SKU metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template */}
          <button
            onClick={triggerCSVTemplateDownload}
            type="button"
            className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDarkMode 
                ? "text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border-blue-500/20" 
                : "text-blue-650 hover:bg-blue-50 bg-white border-blue-200"
            }`}
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Template
          </button>

          {/* Upload CSV */}
          {canImportBulkFiles ? (
            <label className="text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-3.5 py-2 flex items-center gap-1.5 transition-all cursor-pointer border border-blue-500 shadow-md shadow-blue-600/15">
              <ArrowUpToLine className="h-3.5 w-3.5" />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <button
              disabled
              className={`text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-not-allowed opacity-50 font-mono border ${
                isDarkMode ? "bg-white/5 border-white/10 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-405"
              }`}
            >
              <ShieldAlert className="h-3 w-3" />
              Upload Restricted
            </button>
          )}
        </div>
      </div>

      {/* Filtering Filters Row */}
      <div className={`p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 border-b ${
        isDarkMode ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"
      }`}>
        {/* Search */}
        <div className="relative group col-span-1 sm:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by SKU, Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="sku-search-input"
            className={`block w-full rounded-xl pl-10 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode ? "bg-black border-white/10 text-white placeholder-slate-605" : "bg-white border-slate-250 text-slate-800 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            id="category-filter-select"
            className={`block w-full rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer ${
              isDarkMode ? "bg-black border-white/10 text-white" : "bg-white border-slate-250 text-slate-700"
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            id="status-filter-select"
            className={`block w-full rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer ${
              isDarkMode ? "bg-black border-white/10 text-white" : "bg-white border-slate-250 text-slate-700"
            }`}
          >
            <option value="All">Status: All</option>
            <option value="Normal">Normal</option>
            <option value="Stockout Risk">Stockout Risk</option>
            <option value="Overstock">Overstock</option>
          </select>
        </div>
      </div>

      {/* Catalog Listing Table */}
      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse table-auto text-xs">
          <thead>
            <tr className={`border-b text-[10.5px] font-semibold uppercase tracking-wider font-display ${
              isDarkMode ? "bg-white/[0.04] border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-650"
            }`}>
              <th className="px-5 py-3">SKU General Info</th>
              <th className="px-5 py-3">Sales Speed</th>
              <th className="px-5 py-3">Current Stock</th>
              <th className="px-5 py-3">Lead Days & Setup</th>
              <th className="px-5 py-3 text-cyan-500 font-mono">Predictive ROP</th>
              <th className="px-5 py-3 text-emerald-500 font-mono">Safety Buffer</th>
              <th className="px-5 py-3 text-blue-500 font-mono">Optimal EOQ</th>
              <th className="px-5 py-3 text-center">Diagnostics</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs ${
            isDarkMode ? "divide-white/5 text-slate-100" : "divide-slate-205 text-slate-800"
          }`}>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-slate-500 font-mono">
                  No SKUs matched the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isEditing = editingId === item.id;

                let statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                if (item.status === "Stockout Risk") statusBadge = "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse";
                if (item.status === "Overstock") statusBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";

                let speedBadge = "bg-white/10 text-slate-350";
                if (item.salesVelocity === "High") speedBadge = "bg-blue-500/10 text-blue-500 font-semibold";
                if (item.salesVelocity === "Low") speedBadge = "bg-white/5 text-slate-400 font-mono";

                // Average calculation
                const avgHistory = Math.round(item.history.reduce((a, b) => a + b, 0) / (item.history.length || 1));

                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      if (!isEditing) onSelectItem(isSelected ? null : item.id);
                    }}
                    className={`transition-colors ${
                      isSelected 
                        ? isDarkMode ? "bg-blue-600/10" : "bg-blue-50" 
                        : isDarkMode ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                    } ${isEditing ? "bg-white/[0.04]" : "cursor-pointer"}`}
                  >
                    {/* SKU Info */}
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-blue-500 font-bold">{item.sku}</div>
                      <div className={`font-semibold max-w-[180px] truncate block mt-0.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{item.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.category}</div>
                    </td>

                    {/* Sales Velocity */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${speedBadge}`}>
                        {item.salesVelocity || "Medium"}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap font-mono">
                        Avg: {avgHistory} monthly
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editFields.currentStock}
                          onChange={(e) => setEditFields({ ...editFields, currentStock: e.target.value })}
                          disabled={!canEditStockQtyValue}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 py-1 px-1.5 text-center bg-black rounded border border-white/10 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <div className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                          {item.currentStock.toLocaleString()}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap font-mono">
                        Price: ${item.price.toFixed(2)}
                      </div>
                    </td>

                    {/* Lead Days & Setup */}
                    <td className="px-5 py-3.5">
                      <div>
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-semibold text-slate-500 block">Price</span>
                              <input
                                type="text"
                                value={editFields.price}
                                onChange={(e) => setEditFields({ ...editFields, price: e.target.value })}
                                disabled={!canEditPricesAndLeadTime}
                                className="w-14 py-0.5 px-1 bg-black rounded border border-white/10 text-[10px] focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-semibold text-slate-500 block">Lead Days</span>
                              <input
                                type="text"
                                value={editFields.leadTime}
                                onChange={(e) => setEditFields({ ...editFields, leadTime: e.target.value })}
                                disabled={!canEditPricesAndLeadTime}
                                className="w-10 py-0.5 px-1 bg-black rounded border border-white/10 text-[10px] focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5 whitespace-nowrap text-[10.5px] text-slate-500">
                            <div>Order Days: <span className={`${isDarkMode ? "text-slate-350" : "text-slate-700"} font-semibold font-mono`}>{item.leadTime}d</span></div>
                            <div>Setup cost: <span className={`${isDarkMode ? "text-slate-350" : "text-slate-700"} font-mono`}>${item.setupCost}</span></div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ROP */}
                    <td className="px-5 py-3.5 font-mono text-cyan-500 font-semibold">
                      {item.reorderPoint ?? "N/A"}
                    </td>

                    {/* Safety Buffer */}
                    <td className="px-5 py-3.5 font-mono text-emerald-500 font-semibold">
                      {item.safetyStock ?? "N/A"}
                    </td>

                    {/* EOQ */}
                    <td className="px-5 py-3.5 font-mono text-blue-500 font-bold">
                      {item.eoq ?? "N/A"}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block border px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right font-medium">
                      {isEditing ? (
                        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => saveEditing(item.id)}
                            type="button"
                            className="bg-emerald-650 hover:bg-emerald-500 text-white p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            type="button"
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(item);
                          }}
                          type="button"
                          className="bg-white/5 border border-white/10 hover:bg-white/15 p-1.5 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
