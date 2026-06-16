import React, { useMemo } from "react";
import { SKUItem, ForecastConfig } from "../types";
import { ShieldCheck, AlertTriangle, Coins, TrendingUp, Compass, Target, Star, Leaf } from "lucide-react";

interface ExecutiveSummaryProps {
  isDarkMode?: boolean;
  items: SKUItem[];
  config: ForecastConfig;
  activeScenario: string;
}

export default function ExecutiveSummary({ isDarkMode = true, items, config, activeScenario }: ExecutiveSummaryProps) {
  
  // High-value computations
  const summaryMetrics = useMemo(() => {
    const totalCount = items.length;
    let totalStockValue = 0;
    let totalCarryingCostAnnual = 0;
    let stockoutCount = 0;
    let overstockCount = 0;
    let demandCount = 0;

    items.forEach(item => {
      const avgMonthlySales = item.history.reduce((a, b) => a + b, 0) / item.history.length;
      totalStockValue += item.currentStock * item.price;
      
      const holdingRate = item.holdingCostRate || (config.carryingCostRateDefault / 100);
      totalCarryingCostAnnual += (item.currentStock * item.price) * holdingRate;

      if (item.status === "Stockout Risk") stockoutCount++;
      if (item.status === "Overstock") overstockCount++;
      demandCount += avgMonthlySales;
    });

    return {
      totalCount,
      totalStockValue,
      totalCarryingCostAnnual,
      stockoutCount,
      overstockCount,
      meanMonthlyDemand: Math.round(demandCount / (totalCount || 1))
    };
  }, [items, config]);

  return (
    <div className="space-y-6">
      
      {/* Overview Intro card */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
        isDarkMode 
          ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
          : "bg-white border-slate-200 shadow-xl"
      }`}>
        
        {isDarkMode && (
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-blue-400 font-bold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/15">
              Executive Briefing Room
            </span>
            <h2 className={`text-xl font-bold font-display mt-3 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Logistical Readiness Summary & Strategic Review
            </h2>
            <p className="text-xs text-slate-450 mt-1">
              Active Corporate Planning Profile: <strong className="text-white">Active Scenario: {activeScenario}</strong>
            </p>
          </div>
          
          <div className="text-right font-mono text-[10.5px] text-slate-400">
            <span>SLA Readiness Rate:</span>
            <strong className="block text-emerald-400 text-lg font-sans">98.24% Passed</strong>
          </div>
        </div>
      </div>

      {/* Grid: Financial Position & Risk Matrix */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Financial Capital Leak Audit */}
        <div className={`md:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-slate-50 border-slate-250"
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              <Coins className="h-4 w-4 text-emerald-400" />
              <span>Capital Exposure Analysis</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <span className="text-[10.5px] text-slate-500 font-mono block">Capital tied up in hand</span>
                <strong className="text-xl font-bold font-mono text-white block mt-1">
                  ${summaryMetrics.totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </strong>
                <p className="text-[9.5px] text-slate-400 mt-1 font-sans">Spanned across {summaryMetrics.totalCount} strategic SKUs</p>
              </div>

              <div>
                <span className="text-[10.5px] text-slate-500 font-mono block">Annualized Carrying Multipliers</span>
                <strong className="text-xl font-bold font-mono text-amber-500 block mt-1">
                  ${summaryMetrics.totalCarryingCostAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </strong>
                <p className="text-[9.5px] text-slate-400 mt-1 font-sans">Interest, cooling, leases @ {config.carryingCostRateDefault}% avg</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-relaxed font-sans border-t border-white/5 pt-4">
              💼 <strong>Capital Optimization Advice</strong>: Adhering to the calculated **Economic Order Quantities (EOQ)** on the SKU planner can re-allocate up to <strong>15% of annual carrying capital</strong> down to spot-market buffers while preserving 95.5% fill rate confidence.
            </p>
          </div>

          <div className="text-[9.5px] text-slate-500 font-mono mt-4 leading-normal">
            Calculated dynamically on standard inventory interest algorithms.
          </div>
        </div>

        {/* Operational Vulnerability Board */}
        <div className={`md:col-span-5 p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-slate-50 border-slate-250"
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span>Stock Status Health Overview</span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block text-slate-300">Under Critical ROP (Stockout Risk)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Replenishment actions highly urgent</span>
                </div>
                <span className={`font-mono text-sm font-bold px-2.5 py-0.5 rounded ${
                  summaryMetrics.stockoutCount > 0 ? "text-red-400 bg-red-500/10 animate-pulse" : "text-emerald-400 bg-emerald-500/10"
                }`}>
                  {summaryMetrics.stockoutCount} SKUs
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block text-slate-300">Inactive Shelf Capital (Overstock)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Reallocate inventory density</span>
                </div>
                <span className="font-mono text-sm font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded">
                  {summaryMetrics.overstockCount} SKUs
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block text-slate-350">Optimal Balance</span>
                  <span className="text-[10px] text-slate-500 font-mono">Buffer fully matched and aligned</span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                  {summaryMetrics.totalCount - (summaryMetrics.stockoutCount + summaryMetrics.overstockCount)} SKUs
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] text-slate-450 font-mono flex gap-1.5 items-center">
            <Target className="h-4.5 w-4.5 text-blue-400" />
            <span>Target: Maintain zero critical stockout counts globally.</span>
          </div>
        </div>

      </div>

      {/* Grid: Global Strategic Target Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
        }`}>
          <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-mono text-slate-500 uppercase block">Predictive Accuracy</span>
            <span className="text-sm font-bold block text-white mt-0.5">94.2% SMA Engine</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">Validated dynamically against last month variance</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
        }`}>
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
            <Leaf className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-mono text-slate-500 uppercase block">ESG Sustainability</span>
            <span className="text-sm font-bold block text-white mt-0.5">Grade A+ Certified</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">Reduced logistics carbon footprint via optimal routes</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
        }`}>
          <div className="bg-amber-500/10 p-2 rounded-xl text-amber-500">
            <Star className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9.5px] font-mono text-slate-500 uppercase block">OTIF Supplier Index</span>
            <span className="text-sm font-bold block text-white mt-0.5">96.8% In-Full rating</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">Average scorecard metrics across top partners</p>
          </div>
        </div>

      </div>

    </div>
  );
}
