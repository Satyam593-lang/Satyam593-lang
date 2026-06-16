import React, { useMemo } from "react";
import { SKUItem } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { HelpCircle, BarChart3, PieChartIcon, TrendingUp } from "lucide-react";

interface PivotGraphsProps {
  items: SKUItem[];
  selectedItem: SKUItem | null;
  isDarkMode?: boolean;
}

const COLORS = ["#2563EB", "#06B6D4", "#10B981", "#F59E0B", "#84CC16", "#A855F7", "#EC4899", "#64748B"];

export default function PivotGraphs({ items, selectedItem, isDarkMode = true }: PivotGraphsProps) {
  
  // 1. Unified Historical & Forecast Series
  const focalItem = selectedItem || items[0];

  const forecastChartData = useMemo(() => {
    if (!focalItem) return [];

    const data: any[] = [];
    const hist = focalItem.history;
    const labels = focalItem.historyLabels;
    
    hist.forEach((qty, idx) => {
      data.push({
        name: labels[idx] || `Month ${idx + 1}`,
        sales: qty,
        forecast: null,
      });
    });

    const lastHistVal = hist[hist.length - 1];
    const fore = focalItem.forecast || [];
    const foreLabels = focalItem.forecastLabels || [];

    if (fore.length > 0) {
      data[data.length - 1].forecast = lastHistVal;

      fore.forEach((qty, idx) => {
        data.push({
          name: foreLabels[idx] || `F Month ${idx + 1}`,
          sales: null,
          forecast: qty,
        });
      });
    }

    return data;
  }, [focalItem]);

  // 2. Bar Chart: Stock Levels vs. Safety Stock level for active items
  const stockComparisonData = useMemo(() => {
    return items.slice(0, 10).map((item) => ({
      name: item.sku,
      stockName: item.name,
      "Current Stock": item.currentStock,
      "Safety Buffer": item.safetyStock || 0,
      "Reorder Point": item.reorderPoint || 0,
    }));
  }, [items]);

  // 3. Pie Chart: Capital Value distribution by Product Category
  const categoryChartData = useMemo(() => {
    const categoryCapital: { [key: string]: number } = {};
    items.forEach((item) => {
      const cap = item.currentStock * item.price;
      categoryCapital[item.category] = (categoryCapital[item.category] || 0) + cap;
    });

    return Object.keys(categoryCapital).map((cat) => ({
      name: cat,
      value: Math.round(categoryCapital[cat]),
    }));
  }, [items]);

  const gridColor = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const labelColor = isDarkMode ? "#94a3b8" : "#475569";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
      
      {/* Forecasting Line Plot */}
      <div className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
        isDarkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className={`text-sm font-semibold tracking-tight flex items-center gap-2 font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Sales History vs Predictive Demand Forecast Meeting Notes
            </h4>
            {focalItem && (
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                isDarkMode ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}>
                Active SKU: {focalItem.sku}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Showing continuous stitch for <span className={isDarkMode ? "text-white font-medium" : "text-slate-800 font-medium"}>{focalItem ? focalItem.name : "N/A"}</span>.
          </p>
        </div>

        {focalItem ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastChartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={labelColor} fontSize={10} tickLine={false} />
                <YAxis stroke={labelColor} fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#09090b" : "#ffffff", 
                    borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", 
                    borderRadius: "12px", 
                    color: isDarkMode ? "#e2e8f0" : "#0f172a" 
                  }}
                  labelClassName="font-semibold text-blue-400 border-b border-white/10 pb-1 mb-1.5"
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
                <Line
                  name="Historical Sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#2563EB", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
                <Line
                  name="Predictive Forecast"
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10B981"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, stroke: "#10B981", strokeWidth: 2 }}
                  connectNulls
                />
                <ReferenceLine
                  x={focalItem.historyLabels[focalItem.historyLabels.length - 1]}
                  stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
                  strokeDasharray="3 3"
                  label={{ value: "Forecast Transition", fill: isDarkMode ? "#94a3b8" : "#475569", fontSize: 9, position: "top" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex justify-center items-center text-slate-500">
            No SKU data available.
          </div>
        )}
      </div>

      {/* Stock Levels vs Safety Buffer */}
      <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between ${
        isDarkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div>
          <h4 className={`text-sm font-semibold tracking-tight flex items-center gap-2 mb-1 font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Active Stock levels vs Safety Buffers
          </h4>
          <p className="text-xs text-slate-400 mb-6 font-sans">
            Compares physical on-hand stocks against statistical safety buffer limits (top 10 items). Avoid dropping below buffer limit.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={labelColor} fontSize={10} tickLine={false} />
              <YAxis stroke={labelColor} fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDarkMode ? "#09090b" : "#ffffff", 
                  borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", 
                  borderRadius: "12px", 
                  color: isDarkMode ? "#e2e8f0" : "#0f172a" 
                }}
                labelClassName="font-semibold text-blue-400 border-b border-white/10 pb-1 mb-1.5"
                formatter={(value: any, name: any) => {
                  if (name === "Current Stock") {
                    return [`${value.toLocaleString()} units`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend iconType="square" wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
              <Bar name="Current Stock" dataKey="Current Stock" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar name="Safety Buffer" dataKey="Safety Buffer" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.65} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category distribution */}
      <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
        isDarkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div>
          <h4 className={`text-sm font-semibold tracking-tight flex items-center gap-2 mb-1 font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            <PieChartIcon className="h-4 w-4 text-blue-500" />
            Capital Value by Category ($)
          </h4>
          <p className="text-xs text-slate-400 mb-6">
            Allocations of current physical on-hand valuations.
          </p>
        </div>

        <div className="h-56 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDarkMode ? "#09090b" : "#ffffff", 
                  borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",  
                  borderRadius: "12px", 
                  color: isDarkMode ? "#e2e8f0" : "#0f172a" 
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Valuation"]}
              />
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold font-mono">Total Capital</span>
            <span className={`text-[13px] font-bold font-mono ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              ${categoryChartData.reduce((a, b) => a + b.value, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
          {categoryChartData.map((d, index) => (
            <div key={d.name} className={`flex items-center gap-1.5 ${isDarkMode ? "text-slate-305" : "text-slate-650"}`}>
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="truncate">{d.name} ({Math.round((d.value / (categoryChartData.reduce((a,b)=>a+b.value, 0) || 1)) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div className={`lg:col-span-8 p-6 rounded-2xl border ${
        isDarkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-md"
      }`}>
        <h4 className={`text-sm font-semibold tracking-tight flex items-center gap-2 mb-1 font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Predictive Algorithms & Safety Stock Targets
        </h4>
        <p className="text-xs text-slate-400 mb-4 font-sans">
          How the system calculates safety bands and Economic Order quantities for <span className="font-mono text-blue-500 font-semibold">{focalItem ? focalItem.sku : "Selected SKU"}</span>.
        </p>

        {focalItem ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-2">
            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-black/30 border-white/5" : "bg-slate-50 border-slate-200"} space-y-1.5`}>
              <h5 className="font-semibold text-blue-500 uppercase tracking-widest text-[9px] font-mono">Economic Order (EOQ)</h5>
              <p className="text-[10px] text-slate-500">
                Formula: <code className="bg-black/40 text-blue-400 px-1 py-0.5 rounded font-mono">√((2·D·S)/H)</code>
              </p>
              <p className="text-slate-404 leading-relaxed text-[11px]">
                Maintains a dynamic purchase threshold of <span className="font-semibold">{focalItem.eoq} units</span> to match low setup expenses against carrying costs.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-black/30 border-white/5" : "bg-slate-50 border-slate-200"} space-y-1.5`}>
              <h5 className="font-semibold text-red-500 uppercase tracking-widest text-[9px] font-mono">Safety Stock Standard</h5>
              <p className="text-[10px] text-slate-500">
                Formula: <code className="bg-black/40 text-red-400 px-1 py-0.5 rounded font-mono">Z · σ_D · √L</code>
              </p>
              <p className="text-slate-404 leading-relaxed text-[11px]">
                Buffered at <span className="font-semibold font-mono">{focalItem.safetyStock} units</span> to secure 95.5% on-shelf readiness across standard lead cycles.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-black/30 border-white/5" : "bg-slate-50 border-slate-200"} space-y-1.5`}>
              <h5 className="font-semibold text-amber-500 uppercase tracking-widest text-[9px] font-mono">Reorder Pivot Point (ROP)</h5>
              <p className="text-[10px] text-slate-500">
                Formula: <code className="bg-black/40 text-amber-504 px-1 py-0.5 rounded font-mono">d · L + SS</code>
              </p>
              <p className="text-slate-404 leading-relaxed text-[11px]">
                Replenishment triggers automatically when stock falls below <span className="font-mono font-semibold">{focalItem.reorderPoint} units</span> during active lead intervals.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-6 font-mono">
            Please select a SKU record.
          </div>
        )}
      </div>

    </div>
  );
}
