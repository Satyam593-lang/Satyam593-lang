import React, { useState } from "react";
import { MapPin, Plane, Ship, Truck as TruckIcon, AlertTriangle, ShieldCheck } from "lucide-react";

interface Hub {
  id: string;
  name: string;
  coords: { x: number; y: number }; // Relative percentage SVG coordinates
  status: "Normal" | "Congested" | "Weather Alert";
  utilization: number;
  onHandSKUs: number;
  leadTimeAvg: number;
  manager: string;
}

interface Connection {
  from: string;
  to: string;
  type: "Ocean" | "Air" | "Road";
  status: "In-Transit" | "Delayed" | "Customs Hold";
  progress: number; // 0 to 100%
  eta: string;
  cargo: string;
}

const GLOBAL_HUBS: Hub[] = [
  { id: "LAX", name: "North America - Los Angeles Port (LAX)", coords: { x: 18, y: 38 }, status: "Normal", utilization: 72, onHandSKUs: 3450, leadTimeAvg: 9, manager: "Alan Vance" },
  { id: "RTM", name: "Europe - Rotterdam Hub (RTM)", coords: { x: 50, y: 28 }, status: "Congested", utilization: 91, onHandSKUs: 4200, leadTimeAvg: 14, manager: "Helga Visser" },
  { id: "SGP", name: "APAC - Singapore Terminal (SGP)", coords: { x: 78, y: 64 }, status: "Normal", utilization: 58, onHandSKUs: 6100, leadTimeAvg: 6, manager: "Hing Jin" },
  { id: "SZX", name: "APAC - Shenzhen Mega Warehouse (SZX)", coords: { x: 79, y: 44 }, status: "Normal", utilization: 84, onHandSKUs: 12500, leadTimeAvg: 5, manager: "Li Wei" },
  { id: "DXB", name: "Middle East - Dubai Gateway (DXB)", coords: { x: 62, y: 42 }, status: "Normal", utilization: 65, onHandSKUs: 2900, leadTimeAvg: 8, manager: "Faisal Al-Sabah" },
  { id: "EWR", name: "North America - New York Gateway (EWR)", coords: { x: 28, y: 34 }, status: "Weather Alert", utilization: 88, onHandSKUs: 4700, leadTimeAvg: 11, manager: "Marcus Cole" }
];

const HUB_CONNECTIONS: Connection[] = [
  { from: "SZX", to: "LAX", type: "Ocean", status: "In-Transit", progress: 68, eta: "Jun 19, 2026", cargo: "Pro Headphones - 1,200 units" },
  { from: "SZX", to: "RTM", type: "Ocean", status: "Delayed", progress: 42, eta: "Jun 25, 2026", cargo: "Cotton T-Shirts - 4,500 units" },
  { from: "RTM", to: "EWR", type: "Air", status: "In-Transit", progress: 85, eta: "Jun 16, 2026", cargo: "Smart Watch components - 500 units" },
  { from: "DXB", to: "SGP", type: "Ocean", status: "In-Transit", progress: 15, eta: "Jun 29, 2026", cargo: "Industrial Screwdriver sets - 800 units" },
  { from: "LAX", to: "EWR", type: "Road", status: "In-Transit", progress: 50, eta: "Jun 18, 2026", cargo: "Office Ergonomic Chairs - 120 units" }
];

export default function InteractiveMap({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [selectedHub, setSelectedHub] = useState<Hub | null>(GLOBAL_HUBS[0]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const activeHubShipments = HUB_CONNECTIONS.filter(
    (c) => c.from === selectedHub?.id || c.to === selectedHub?.id
  );

  return (
    <div className={`rounded-3xl border transition-all duration-300 ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    } p-6 overflow-hidden relative`}>
      
      {/* Glow Effects */}
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isDarkMode ? "bg-cyan-400" : "bg-blue-600"} animate-ping`}></span>
            <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Global Multimodal Control Tower Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Live telemetry displaying oceanic, air, and ground transits intersecting key global hubs.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Hub
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Congested
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Weather Alert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-8 border-t-2 border-dashed border-cyan-400/40 inline-block"></span> Ocean Path
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Interactive Map Visual Stage */}
        <div className={`lg:col-span-8 relative rounded-2xl border ${
          isDarkMode ? "bg-slate-950/80 border-white/5" : "bg-slate-50 border-slate-200"
        } aspect-[1.8/1] w-full flex items-center justify-center p-2 group`}>
          
          {/* Subtle Grid overlay for sci-fi look */}
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl ${
            !isDarkMode && "opacity-[0.1]"
          }`}></div>

          {/* SVG Vector World map outline mock */}
          <svg viewBox="0 0 100 60" className="w-full h-full opacity-65 select-none pointer-events-none">
            {/* North America */}
            <path d="M12,12 Q18,10 24,15 T30,28 T25,48 T12,42 T8,18 Z" fill={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="0.5" />
            {/* South America */}
            <path d="M26,46 Q31,48 35,50 T32,58 T24,55 T23,48 Z" fill={isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" />
            {/* Europe / Northern Eurasia */}
            <path d="M42,12 Q55,8 65,11 T85,15 T92,32 T80,38 T65,30 T50,22 Z" fill={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="0.5" />
            {/* Africa */}
            <path d="M48,25 Q58,26 62,35 T58,56 T48,42 T42,32 Z" fill={isDarkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" />
            {/* Indochina / Australia */}
            <path d="M72,40 Q82,42 85,50 T80,58 T72,55 T70,48 Z" fill={isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" />

            {/* Connecting lines - visual curves */}
            {HUB_CONNECTIONS.map((c, i) => {
              const fromHub = GLOBAL_HUBS.find((h) => h.id === c.from);
              const toHub = GLOBAL_HUBS.find((h) => h.id === c.to);
              if (!fromHub || !toHub) return null;
              
              const isSelected = selectedConnection === c;
              
              const midX = (fromHub.coords.x + toHub.coords.x) / 2;
              const midY = (fromHub.coords.y + toHub.coords.y) / 2 - 5; // offset upward for arched vector
              const pathStr = `M ${fromHub.coords.x} ${fromHub.coords.y} Q ${midX} ${midY} ${toHub.coords.x} ${toHub.coords.y}`;
              
              let strokeCol = isDarkMode ? "rgba(6, 182, 212, 0.45)" : "rgba(37, 99, 235, 0.45)"; // Cyan / Blue default
              if (c.status === "Delayed") strokeCol = "rgba(245, 158, 11, 0.55)";
              if (c.status === "Customs Hold") strokeCol = "rgba(239, 68, 68, 0.55)";

              return (
                <g key={i} className="cursor-pointer" onClick={() => setSelectedConnection(c)}>
                  {/* Outer glow aura */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke={isSelected ? "#06B6D4" : "transparent"}
                    strokeWidth={isSelected ? "1.5" : "0.5"}
                    opacity="0.6"
                  />
                  {/* Core connection path */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke={strokeCol}
                    strokeWidth="0.4"
                    strokeDasharray={c.type === "Air" ? "1.5,1.5" : c.type === "Road" ? "3,1.5" : "none"}
                  />
                  {/* Moving pulse dot along the path to simulate flow */}
                  <circle r="0.45" fill={c.status === "In-Transit" ? "#10B981" : "#06B6D4"}>
                    <animateMotion dur="8s" repeatCount="indefinite" path={pathStr} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Interactive Hub Node Pins overlay */}
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            let themeStatusColor = "bg-emerald-500 shadow-emerald-500/20";
            if (hub.status === "Congested") themeStatusColor = "bg-amber-500 shadow-amber-500/20";
            if (hub.status === "Weather Alert") themeStatusColor = "bg-red-500 shadow-red-500/20";

            return (
              <button
                key={hub.id}
                onClick={() => {
                  setSelectedHub(hub);
                  setSelectedConnection(null);
                }}
                className="absolute group/pin transition-transform duration-200 hover:scale-125 focus:outline-none"
                style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
              >
                {/* Ping aura */}
                <span className={`absolute -inset-2.5 rounded-full ${themeStatusColor} opacity-15 animate-ping`}></span>
                {/* Node Dot */}
                <span className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black/80 shadow-md ${themeStatusColor}`}>
                  {isSelected && <span className="absolute w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>

                {/* Micro tooltip label overlay */}
                <span className={`absolute top-5 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-[8px] font-mono font-semibold tracking-wider transition-opacity whitespace-nowrap shadow-md ${
                  isDarkMode ? "bg-slate-900 border border-white/10 text-slate-300" : "bg-white border border-slate-200 text-slate-700"
                } ${isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover/pin:opacity-100"}`}>
                  {hub.id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Context Detail Card Section */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {selectedHub ? (
            <div className={`p-5 rounded-2xl border flex flex-col justify-between flex-grow ${
              isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <span className={`text-[8.5px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  selectedHub.status === "Normal" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  selectedHub.status === "Congested" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse" :
                  "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse"
                }`}>
                  Status: {selectedHub.status}
                </span>

                <h4 className={`text-base font-semibold font-display mt-3 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  {selectedHub.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Site Director: <span className="text-slate-300 font-sans">{selectedHub.manager}</span>
                </p>

                {/* Warehouse Metrics grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Dock Utilization</span>
                    <span className={`text-sm font-bold block mt-0.5 ${selectedHub.utilization > 85 ? "text-amber-500" : "text-emerald-400"}`}>
                      {selectedHub.utilization}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full ${selectedHub.utilization > 85 ? "bg-amber-500" : "bg-emerald-400"}`} style={{ width: `${selectedHub.utilization}%` }}></div>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Avg Turnaround</span>
                    <span className="text-sm font-bold text-white block mt-0.5 font-mono">
                      {selectedHub.leadTimeAvg} days
                    </span>
                    <span className="text-[8.5px] text-slate-500 mt-1 block">SLA performance: 94.8%</span>
                  </div>
                </div>

                {/* Connected / Docked Shipments */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Connected Route Transits</span>
                  
                  {activeHubShipments.length === 0 ? (
                    <p className="text-[11px] text-slate-500 py-2 italic">No active direct transits currently cataloged.</p>
                  ) : (
                    <div className="space-y-2 overflow-y-auto max-h-[140px]">
                      {activeHubShipments.map((c, idx) => (
                        <div key={idx} className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                          isDarkMode ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]" : "bg-white border-slate-150 hover:bg-slate-100"
                        }`}>
                          <div className="flex items-center gap-2">
                            {c.type === "Ocean" ? <Ship className="h-3.5 w-3.5 text-cyan-400" /> :
                             c.type === "Air" ? <Plane className="h-3.5 w-3.5 text-blue-400" /> :
                             <TruckIcon className="h-3.5 w-3.5 text-slate-400" />}
                            <div className="text-left leading-tight truncate max-w-[120px]">
                              <span className="text-white font-medium block truncate">{c.cargo}</span>
                              <span className="text-[9px] text-slate-500 font-mono">{c.from} ➔ {c.to}</span>
                            </div>
                          </div>
                          <div className="text-right leading-tight font-mono shrink-0">
                            <span className={`text-[10px] block ${
                              c.status === "Delayed" ? "text-amber-500 font-bold" :
                              c.status === "Customs Hold" ? "text-red-500 font-bold" : "text-emerald-400"
                            }`}>{c.status}</span>
                            <span className="text-[8.5px] text-slate-500 block">ETA: {c.eta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              
              {/* Strategic Directive feedback */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-start gap-2.5 text-[10px] text-slate-400">
                {selectedHub.status === "Normal" ? (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>All incoming container freight cleared for berth slot scheduling. No operational bottlenecks detected.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Hub experiencing backlogs. Consider activating Scenario Planner to reroute next shipments to alternate gateways.</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-5 rounded-2xl border text-center flex items-center justify-center h-full text-slate-500 ${
              isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
            }`}>
              Click any hub node on the map to visualize dock telemetry.
            </div>
          )}

          {/* Connected Route Focus Card (Only if clicked route path) */}
          {selectedConnection && (
            <div className={`p-4 rounded-xl border border-cyan-500/20 flex flex-col bg-cyan-500/5 ${
              isDarkMode ? "text-slate-100" : "text-slate-800"
            }`}>
              <h5 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-cyan-400">Selected Cargo In-Transit</h5>
              <div className="flex items-center gap-2 mt-1">
                {selectedConnection.type === "Ocean" ? <Ship className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                <span className="text-xs font-semibold">{selectedConnection.cargo}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Route: {selectedConnection.from} ➔ {selectedConnection.to} • ETA: {selectedConnection.eta}</p>
              
              <div className="mt-2.5">
                <div className="flex justify-between text-[8.5px] font-mono text-slate-500 mb-1">
                  <span>Transit Stream Progress</span>
                  <span>{selectedConnection.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${selectedConnection.progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
