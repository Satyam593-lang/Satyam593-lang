import React from "react";
import { SKUItem, ForecastConfig } from "../types";

interface PrintPDFReportProps {
  items: SKUItem[];
  config: ForecastConfig;
  insights: string | null;
}

export default function PrintPDFReport({ items, config, insights }: PrintPDFReportProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalCapitalValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const stockoutRiskCount = items.filter(item => item.status === "Stockout Risk").length;
  const overstockCount = items.filter(item => item.status === "Overstock").length;

  return (
    <div className="hidden print:block bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans text-xs">
      
      {/* Header briefing */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-1">LogiCast Enterprise Analytics</span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Predictive Supply Chain & Inventory Executive Report</h1>
          <p className="text-xs text-slate-500 mt-1">Sensing Algorithm: {config.method} Model • Horizon: {config.horizon} Months • Carrying interest: {config.carryingCostRateDefault}%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono font-semibold uppercase text-blue-700">Advisory Sheet #4412</p>
          <p className="text-[10px] text-slate-400 mt-1">{currentDate}</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="block text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Portfolio Capitalization</span>
          <span className="text-base font-bold text-slate-900 block mt-1">
            ${totalCapitalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[9px] text-slate-400 block mt-1">{items.length} active corporate lines</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="block text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Estimated Carrying cost</span>
          <span className="text-base font-bold text-slate-900 block mt-1">
            ${(totalCapitalValue * (config.carryingCostRateDefault / 100)).toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </span>
          <span className="text-[9px] text-slate-400 block mt-1">Tied up warehouse operations</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="block text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Stockout Vulnerability</span>
          <span className="text-base font-bold text-red-600 block mt-1">
            {stockoutRiskCount} Items
          </span>
          <span className="text-[9px] text-slate-400 block mt-1">Below safety replenishment ROP</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="block text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Overstocked Count</span>
          <span className="text-base font-bold text-yellow-600 block mt-1">
            {overstockCount} Items
          </span>
          <span className="text-[9px] text-slate-400 block mt-1">Excessive slow shelf allocations</span>
        </div>
      </div>

      {/* Corporate sku list table */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1.5 mb-2">Item-Level Replenishment Directives</h3>
        <table className="w-full text-left border-collapse border-b border-slate-200">
          <thead>
            <tr className="bg-slate-100/80 text-[9px] font-bold text-slate-600 uppercase border-y border-slate-200">
              <th className="px-3 py-1.5">SKU Code</th>
              <th className="px-3 py-1.5">Product Name</th>
              <th className="px-3 py-1.5 text-right">Stock</th>
              <th className="px-3 py-1.5 text-right">Price</th>
              <th className="px-3 py-1.5 text-right">ROP Threshold</th>
              <th className="px-3 py-1.5 text-right">Safety Buffer</th>
              <th className="px-3 py-1.5 text-right">Replenish EOQ</th>
              <th className="px-3 py-1.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-[10px]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-mono font-semibold text-blue-800">{item.sku}</td>
                <td className="px-3 py-2 font-medium">{item.name}</td>
                <td className="px-3 py-2 text-right">{item.currentStock.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${item.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono">{item.reorderPoint}</td>
                <td className="px-3 py-2 text-right font-mono">{item.safetyStock}</td>
                <td className="px-3 py-2 text-right font-mono text-blue-900 font-semibold">{item.eoq}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    item.status === "Normal"
                      ? "bg-emerald-100 text-emerald-850 border border-emerald-200"
                      : item.status === "Stockout Risk"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Advisory block */}
      {insights && (
        <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest border-b border-blue-200 pb-1.5 mb-2">Gemini AI Executive Playbook Insights</h3>
          <div className="text-[10px] text-slate-755 leading-relaxed prose prose-sm max-w-none">
            {insights.split("\n\n").slice(0, 5).map((paragraph, i) => (
              <p key={i} className="mb-2">{paragraph.replace(/[#*]/g, "")}</p>
            ))}
          </div>
        </div>
      )}

      {/* Compliance / Signature blocks */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-200">
        <div className="space-y-4">
          <p className="text-[10px] text-slate-400">This forecast is prepared using automated corporate demand sensing time-series computations. Parameter bounds are verified by current permissions profiles.</p>
          <div className="flex gap-4">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400">Created by</span>
              <span className="block text-xs font-bold text-slate-800">Demand Intelligence Engine</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400">Approved by</span>
              <span className="block text-xs font-semibold text-slate-700">Sara Chen (Director of Supply Chair)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-end">
          <div className="text-right border-t border-slate-400 w-48 pt-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 block">Authorized Signature</span>
          </div>
        </div>
      </div>

    </div>
  );
}
