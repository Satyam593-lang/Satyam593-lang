import React from "react";
import { Sliders, HelpCircle, Flame, Gift, DollarSign, RefreshCw, Compass } from "lucide-react";

export type ScenarioID = "baseline" | "suez" | "promo" | "inflation";

interface Scenario {
  id: ScenarioID;
  title: string;
  category: string;
  shortDesc: string;
  holdingRateMod: string;
  leadTimeMod: string;
  demandMod: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "baseline",
    title: "Baseline Operational Mode",
    category: "Standard",
    shortDesc: "Standard logistics SLAs with current historical demand trends and domestic carrying interest.",
    holdingRateMod: "Unmodified",
    leadTimeMod: "Standard Days",
    demandMod: "Flat"
  },
  {
    id: "suez",
    title: "Suez Canal Chokepoint Closure",
    category: "Geopolitical Crisis",
    shortDesc: "Reroutes all ocean container vessels around the Cape of Good Hope. Universal shipping delays of +12 days and increased setup bunker adjustments.",
    holdingRateMod: "+5% risk cost",
    leadTimeMod: "+12 days delay",
    demandMod: "Flat"
  },
  {
    id: "promo",
    title: "Q4 Holiday Season Promotional Spike",
    category: "Commercial Shift",
    shortDesc: "Intense seasonal marketing pushes and consumer spike. Shifts historical demand baseline by +50% across apparel, electronics, and food categories.",
    holdingRateMod: "Unmodified",
    leadTimeMod: "Flat",
    demandMod: "+50% Volume"
  },
  {
    id: "inflation",
    title: "Carrying Inflation Surcharge (Double rate)",
    category: "Macroeconomic",
    shortDesc: "Warehouse lease interest and storage heating costs double from energy inflation. Forces lower EOQ purchase ratios to defend capital liquidity.",
    holdingRateMod: "Double cost (2x)",
    leadTimeMod: "Flat",
    demandMod: "Flat"
  }
];

interface ScenarioSimulatorProps {
  isDarkMode?: boolean;
  activeScenario: ScenarioID;
  onChangeScenario: (id: ScenarioID) => void;
}

export default function ScenarioSimulator({ isDarkMode = true, activeScenario, onChangeScenario }: ScenarioSimulatorProps) {
  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-blue-400" />
            <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              What-If Supply Chain Scenario Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stress-test inventory indicators by injecting global systemic anomalies. Formulas instantly recalculate Safety Buffers, ROPs, and EOQs.
          </p>
        </div>

        {activeScenario !== "baseline" && (
          <button
            onClick={() => onChangeScenario("baseline")}
            type="button"
            className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            Reset Simulator
          </button>
        )}
      </div>

      {/* Scenarios cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {SCENARIOS.map((sc) => {
          const isActive = activeScenario === sc.id;
          
          let cardBorderClass = isDarkMode ? "border-white/5 bg-white/[0.01]" : "border-slate-150 bg-slate-50";
          let activePillColor = "bg-slate-600 text-slate-300";

          if (isActive) {
            cardBorderClass = "border-blue-500/30 bg-blue-500/10 ring-2 ring-blue-500 shadow-md shadow-blue-500/5";
            activePillColor = "bg-blue-600 text-white";
          } else {
            cardBorderClass += isDarkMode ? " hover:bg-white/[0.03]" : " hover:bg-slate-100";
          }

          let icon = <Compass className="h-5 w-5 text-slate-400" />;
          if (sc.id === "suez") icon = <Flame className="h-5 w-5 text-red-400" />;
          if (sc.id === "promo") icon = <Gift className="h-5 w-5 text-amber-500" />;
          if (sc.id === "inflation") icon = <DollarSign className="h-5 w-5 text-emerald-400" />;

          return (
            <button
              key={sc.id}
              onClick={() => onChangeScenario(sc.id)}
              type="button"
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer h-full ${cardBorderClass}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{sc.category}</span>
                  <div className={`p-1.5 rounded-xl ${isActive ? "bg-blue-500/20" : "bg-black/10"}`}>
                    {icon}
                  </div>
                </div>

                <h4 className={`text-sm font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  {sc.title}
                </h4>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {sc.shortDesc}
                </p>
              </div>

              {/* Formula Modifiers metrics list */}
              <div className="border-t border-white/5 mt-4 pt-3 space-y-1 text-[9.5px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>Carrying Weight:</span>
                  <strong className={isActive ? "text-blue-400" : "text-slate-400"}>{sc.holdingRateMod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lead-time Buffer:</span>
                  <strong className={isActive ? "text-blue-400" : "text-slate-400"}>{sc.leadTimeMod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Demand Velocity:</span>
                  <strong className={isActive ? "text-blue-400" : "text-slate-400"}>{sc.demandMod}</strong>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeScenario !== "baseline" && (
        <div className="mt-5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex gap-2 items-start text-blue-300 relative z-10 animate-fade-in">
          <RefreshCw className="h-4.5 w-4.5 animate-spin text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-white">Active Simulation Offset Enabled</span>
            <span className="text-slate-400 block mt-0.5">
              The entire Time-Series Forecasting chart, Safety Stock formulas, current ROP values, and Stockout Risks are actively modulated by this stress-testing scenario. Check the Forecasting Page or SKU Planner to review altered buffers.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
