import React from "react";
import { Leaf, ShieldAlert, Sparkles, Earth, Globe, HelpCircle, Activity } from "lucide-react";

export default function SustainabilityTracker({ isDarkMode = true, totalSKUs = 8 }: { isDarkMode?: boolean; totalSKUs?: number }) {
  // Simulated stats
  const carbonTons = 482.4;
  const transitModeEfficiency = [
    { mode: "Ocean Transit", share: 65, co2PerTonKm: "10-40g" },
    { mode: "Freight Ground Truck", share: 20, co2PerTonKm: "60-150g" },
    { mode: "Air Freight Express", share: 15, co2PerTonKm: "500g+" }
  ];

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4.5 w-4.5 text-emerald-400" />
            <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              SaaS Carbon Intelligence & ESG Footprint
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking scope-3 inter-continental shipment CO2 expenditures and sustainable logistics KPIs.
          </p>
        </div>

        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-[10px] font-mono rounded-full font-semibold">
          LEED Category Scorecard: Gold Class
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Carbon Stats cards */}
        <div className="lg:col-span-8 grid sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-250"}`}>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Total Carbon Output</span>
            <span className="text-xl font-bold text-white block mt-1.5 font-mono">
              {carbonTons} <span className="text-xs text-slate-400">tonnes eCO2</span>
            </span>
            <span className="text-[9.5px] text-emerald-400 block mt-1 font-mono">📉 -14.2% YTD Reduction</span>
          </div>

          <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-250"}`}>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Green Packaging Quotient</span>
            <span className="text-xl font-bold text-white block mt-1.5 font-mono">
              88.5% <span className="text-xs text-slate-400">of raw</span>
            </span>
            <span className="text-[9.5px] text-slate-500 block mt-1">Zero un-recyclable plastics policy</span>
          </div>

          <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-250"}`}>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Local Sourcing Ratio</span>
            <span className="text-xl font-bold text-white block mt-1.5 font-mono">
              34% <span className="text-xs text-slate-400">by expense</span>
            </span>
            <span className="text-[9.5px] text-slate-500 block mt-1 font-sans">Lowering transit fuel burns</span>
          </div>

          {/* Detailed Transit Mode Distribution grid */}
          <div className={`sm:col-span-3 p-4 rounded-2xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"}`}>
            <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block mb-3">Multimodal Transport CO2 Audit</span>
            
            <div className="space-y-3">
              {transitModeEfficiency.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-255">{item.mode}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.share}% share • CO2 rate: <strong className="text-white">{item.co2PerTonKm}</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.mode.includes("Air") ? "bg-red-500" :
                        item.mode.includes("Ground") ? "bg-amber-500" : "bg-emerald-400"
                      }`} 
                      style={{ width: `${item.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: ESG Rating & Offset Certificate */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${
            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                  Enterprise ESG Compliance
                </span>
                <Globe className="h-4 w-4 text-emerald-400" />
              </div>

              {/* ESG Score panel */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl font-black text-emerald-400 font-mono">
                  A+
                </div>
                <div>
                  <h4 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-slate-850"}`}>
                    Sustainalytics Index Rating
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-mono">Rank: Top 4.8% of global retailers</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
                Our predictive sizing modules defend overprinting and obsolete overstocks, contributing of saved landfill dumpage by matches setup EOQ perfectly to seasonal demand.
              </p>
            </div>

            {/* Simulated test button */}
            <div className="mt-6 pt-3 border-t border-white/5">
              <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                Sustainability metrics certified under ISO 14001:2015 environmental auditing.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
