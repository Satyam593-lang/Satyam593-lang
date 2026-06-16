import React, { useState } from "react";
import { Table, Server, Flame, HardDrive, Layers, RefreshCw, AlertTriangle } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  region: string;
  capacityUtilization: number; // in percent
  pickingSpeedSeconds: number; // average packing speed in secs
  pickingErrorRate: number; // in percent
  aisles: { id: string; loadFactor: number; tempOK: boolean }[];
  incidentStatus: "Normal" | "Maintanence Required" | "Thermal Spike";
}

const WAREHOUSE_DATA: Warehouse[] = [
  {
    id: "WH-US-EAST",
    name: "North America East (Atlanta)",
    region: "US East",
    capacityUtilization: 88,
    pickingSpeedSeconds: 42,
    pickingErrorRate: 1.2,
    incidentStatus: "Normal",
    aisles: [
      { id: "Aisle A", loadFactor: 95, tempOK: true },
      { id: "Aisle B", loadFactor: 89, tempOK: true },
      { id: "Aisle C", loadFactor: 92, tempOK: true },
      { id: "Aisle D", loadFactor: 76, tempOK: true }
    ]
  },
  {
    id: "WH-US-WEST",
    name: "North America West (Oakland)",
    region: "US West",
    capacityUtilization: 68,
    pickingSpeedSeconds: 38,
    pickingErrorRate: 0.8,
    incidentStatus: "Normal",
    aisles: [
      { id: "Aisle A", loadFactor: 60, tempOK: true },
      { id: "Aisle B", loadFactor: 72, tempOK: true },
      { id: "Aisle C", loadFactor: 74, tempOK: true },
      { id: "Aisle D", loadFactor: 66, tempOK: true }
    ]
  },
  {
    id: "WH-EU-CENTRAL",
    name: "Europe Central Hub (Frankfurt)",
    region: "EU",
    capacityUtilization: 94,
    pickingSpeedSeconds: 52,
    pickingErrorRate: 2.1,
    incidentStatus: "Thermal Spike",
    aisles: [
      { id: "Aisle A", loadFactor: 98, tempOK: true },
      { id: "Aisle B", loadFactor: 99, tempOK: false }, // thermal issue
      { id: "Aisle C", loadFactor: 92, tempOK: true },
      { id: "Aisle D", loadFactor: 87, tempOK: true }
    ]
  },
  {
    id: "WH-APAC-SINGAPORE",
    name: "APAC Megacenter (Singapore)",
    region: "APAC",
    capacityUtilization: 58,
    pickingSpeedSeconds: 29,
    pickingErrorRate: 0.3,
    incidentStatus: "Normal",
    aisles: [
      { id: "Aisle A", loadFactor: 55, tempOK: true },
      { id: "Aisle B", loadFactor: 61, tempOK: true },
      { id: "Aisle C", loadFactor: 59, tempOK: true },
      { id: "Aisle D", loadFactor: 57, tempOK: true }
    ]
  }
];

export default function WarehousePerformance({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [selectedWH, setSelectedWH] = useState<Warehouse>(WAREHOUSE_DATA[0]);

  // Simulate resetting thermal alert / cooling
  const [data, setData] = useState<Warehouse[]>(WAREHOUSE_DATA);
  const handleActivateCooling = (whId: string) => {
    setData((prev) =>
      prev.map((wh) => {
        if (wh.id === whId) {
          return {
            ...wh,
            incidentStatus: "Normal",
            aisles: wh.aisles.map((a) => ({ ...a, tempOK: true }))
          };
        }
        return wh;
      })
    );
    // Sync selection
    setSelectedWH((prev) => {
      if (prev.id === whId) {
        return {
          ...prev,
          incidentStatus: "Normal",
          aisles: prev.aisles.map((a) => ({ ...a, tempOK: true }))
        };
      }
      return prev;
    });
  };

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Symmetric Capacity Utilization Heat Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Telemetry metrics tracking volumetric storage loads, average packing speeds, and cooling thermal thresholds.
          </p>
        </div>

        <div className="flex gap-2 text-[10px] font-mono select-none">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Under 70%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded"></span> 70% - 90%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-red-500 rounded"></span> Over 90%
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Performance Grid (Heat Map Style) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {data.map((wh) => {
              const cap = wh.capacityUtilization;
              let capColorClass = "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
              let pillColor = "bg-emerald-500";
              
              if (cap >= 70 && cap < 90) {
                capColorClass = "border-amber-500/20 bg-amber-500/5 text-amber-500";
                pillColor = "bg-amber-500";
              } else if (cap >= 90) {
                capColorClass = "border-red-500/20 bg-red-500/5 text-red-500";
                pillColor = "bg-red-500";
              }

              const isSelected = selectedWH.id === wh.id;

              return (
                <button
                  key={wh.id}
                  onClick={() => setSelectedWH(wh)}
                  type="button"
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected 
                      ? "ring-2 ring-blue-500 bg-blue-500/5 border-blue-500/30" 
                      : isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider">{wh.region}</span>
                    <span className={`h-2 w-2 rounded-full ${pillColor}`}></span>
                  </div>

                  <h4 className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    {wh.name}
                  </h4>

                  {/* Heat scale preview */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Volumetric Usage:</span>
                    <span className="font-bold font-mono text-xs">{cap}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full ${pillColor}`} style={{ width: `${cap}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-450 font-mono">
                    <div>
                      <span>Pick Speed:</span>
                      <strong className="block text-white font-sans text-[11px] mt-0.5">{wh.pickingSpeedSeconds}s / item</strong>
                    </div>
                    <div>
                      <span>Error Margin:</span>
                      <strong className="block text-white font-sans text-[11px] mt-0.5">{wh.pickingErrorRate}%</strong>
                    </div>
                  </div>

                  {wh.incidentStatus !== "Normal" && (
                    <span className="absolute top-2 right-6 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Informational Tip */}
          <div className={`p-4 rounded-xl border flex gap-3 text-xs text-slate-300 ${
            isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
          }`}>
            <Layers className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Symmetric Load Balanced Storage Protocol</span>
              <span className="text-slate-450 block mt-1 leading-relaxed">
                Logistics managers can track stock distributions across physical zones. Overstocked regions (marked red) are advised to shift inventory density to dry docks in US-West (Atlanta shifts to Oakland).
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Warehouse Aisle Telemetry */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${
            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                  Live Aisle Readouts
                </span>
                <span className="text-slate-400 text-xs font-mono font-bold">
                  {selectedWH.id}
                </span>
              </div>

              <h4 className={`text-base font-semibold font-display mt-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                {selectedWH.name}
              </h4>

              {/* Aisle Grid Blocks */}
              <div className="mt-4 space-y-3">
                {selectedWH.aisles.map((aisle, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${
                    isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-white border-slate-150"
                  }`}>
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-slate-400 font-sans font-semibold">{aisle.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        aisle.tempOK ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10" : "text-red-400 bg-red-500/10 border border-red-500/20 animate-pulse"
                      }`}>
                        {aisle.tempOK ? "Cold Temp: OK" : "Thermal Violation!"}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Bin Load Factor</span>
                      <span>{aisle.loadFactor}%</span>
                    </div>

                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full ${
                        aisle.loadFactor > 90 ? "bg-red-500" :
                        aisle.loadFactor > 75 ? "bg-amber-500" : "bg-blue-500"
                      }`} style={{ width: `${aisle.loadFactor}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aisle Corrective Cooling Actions */}
            <div className="mt-6 pt-3 border-t border-white/5">
              {selectedWH.incidentStatus === "Thermal Spike" ? (
                <button
                  onClick={() => handleActivateCooling(selectedWH.id)}
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1.5 shadow-md shadow-red-600/15"
                >
                  <Flame className="h-4 w-4 animate-bounce" />
                  Trigger Cryogenic HVAC Coolers
                </button>
              ) : (
                <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 p-1 font-mono">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                  <span>HVAC automated cooling metrics fully aligned.</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
