import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, Mail, Siren, Eye, RefreshCw, Layers, CheckCircle } from "lucide-react";

interface RiskAlert {
  id: string;
  source: string;
  hazardType: "Geopolitical" | "Labor" | "Weather" | "Customs congestion";
  severity: "Critical" | "High" | "Medium";
  impactZone: string;
  reportDate: string;
  status: "Active" | "Bypassed" | "Mitigated";
  description: string;
  suggestedSafetyOffset: number; // suggested percentage increase in safety stock, e.g. 50
}

const INITIAL_ALERTS: RiskAlert[] = [
  {
    id: "RSK-302",
    source: "Global Weather Satellite Feed",
    hazardType: "Weather",
    severity: "Critical",
    impactZone: "Southeastern China Transit Routes",
    reportDate: "Today, 10:24 AM",
    status: "Active",
    description: "Super Typhoon warning near Ningbo-Zhoushan, locking down oceanic cargo embarkations for 48-72 hours.",
    suggestedSafetyOffset: 50
  },
  {
    id: "RSK-303",
    source: "Port Authority Telex",
    hazardType: "Labor",
    severity: "High",
    impactZone: "New York Port Gateway (EWR)",
    reportDate: "Yesterday, 4:11 PM",
    status: "Active",
    description: "Unplanned stevedor union labor negotiation stalling gate terminal entries. Expected rail container dispatch delays.",
    suggestedSafetyOffset: 30
  },
  {
    id: "RSK-304",
    source: "Maritime Trade Intelligence",
    hazardType: "Geopolitical",
    severity: "Medium",
    impactZone: "Red Sea / Suez Canal Corridor",
    reportDate: "Jun 14, 2:15 PM",
    status: "Mitigated",
    description: "Vessels rerouting around Cape of Good Hope. Lead times successfully increased on all connected Mediterranean SKUs.",
    suggestedSafetyOffset: 0
  }
];

export default function RiskAlertsCenter({ isDarkMode = true, onApplySafetyOffset }: { isDarkMode?: boolean; onApplySafetyOffset?: (percentage: number) => void }) {
  const [alerts, setAlerts] = useState<RiskAlert[]>(INITIAL_ALERTS);
  const [dismissedCount, setDismissedCount] = useState(0);

  const handleMitigate = (id: string, offset: number) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: "Mitigated" };
      }
      return a;
    }));
    if (onApplySafetyOffset && offset > 0) {
      onApplySafetyOffset(offset);
    }
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setDismissedCount(c => c + 1);
  };

  const activeAlerts = alerts.filter(a => a.status === "Active");

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500`}></span>
            </span>
            <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Global Supply Threat Registry & Alerts
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time warnings scraping marine navigation telexes and geo-political hazard logs.
          </p>
        </div>

        <div className={`px-3 py-1 text-[10px] font-mono rounded-full border ${
          activeAlerts.length > 0
            ? "bg-red-500/10 text-red-400 border-red-500/20"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        }`}>
          {activeAlerts.length} ACTIVE HAZARD ALERTS
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Dynamic Alerts Stack */}
        <div className="lg:col-span-8 space-y-4">
          {alerts.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border text-slate-500 text-xs font-mono border-dashed ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            }`}>
              All supply vectors clear. Zero active alerts detected.
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                let badgeStyle = "bg-red-500/10 text-red-400 border border-red-500/20";
                if (alert.severity === "High") badgeStyle = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                if (alert.severity === "Medium") badgeStyle = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                if (alert.status === "Mitigated") badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      isDarkMode 
                        ? alert.status === "Mitigated" ? "bg-white/[0.01] border-white/5" : "bg-white/[0.03] border-white/10"
                        : alert.status === "Mitigated" ? "bg-slate-50 border-slate-150" : "bg-slate-100/60 border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${badgeStyle}`}>
                          {alert.severity} • {alert.hazardType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{alert.id}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{alert.reportDate}</span>
                    </div>

                    <h4 className={`text-sm font-semibold mt-1 flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      {alert.status === "Mitigated" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      {alert.impactZone}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {alert.description}
                    </p>

                    <p className="text-[10px] text-slate-500 font-mono mt-2">
                      Source Integrity: <strong className="text-slate-450">{alert.source}</strong>
                    </p>

                    {/* Interactive Resolution */}
                    <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
                      <div>
                        {alert.suggestedSafetyOffset > 0 && alert.status === "Active" ? (
                          <span className="text-[10.5px] text-amber-400 font-mono block">
                            💡 Mitigation: Increase Safety Stock by +<strong>{alert.suggestedSafetyOffset}%</strong>
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-slate-500 font-mono block">
                            Status: Mitigated / Solved via operational policy
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {alert.status === "Active" && (
                          <button
                            onClick={() => handleMitigate(alert.id, alert.suggestedSafetyOffset)}
                            type="button"
                            className="text-[10px] px-3 py-1.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow"
                          >
                            Dispatch Safe Buffer (+{alert.suggestedSafetyOffset}%)
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          type="button"
                          className="text-[10px] px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          Dismiss Alert
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Risk Severity Gauge Telemetry */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${
            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">
                  Aggregate Risk Telemetry
                </span>
              </div>

              {/* Dial Gauge Visual */}
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" fill="transparent" stroke={isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeWidth="10" />
                    <circle cx="72" cy="72" r="60" fill="transparent" stroke={activeAlerts.length > 1 ? "#EF4444" : activeAlerts.length === 1 ? "#F59E0B" : "#10B981"} strokeWidth="10" strokeDasharray="376" strokeDashoffset={376 - (376 * (activeAlerts.length * 33)) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center leading-tight">
                    <span className="text-2xl font-black text-white font-mono">{activeAlerts.length > 1 ? "HIGH" : activeAlerts.length === 1 ? "MEDIUM" : "LOW"}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Threat Level</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-4 px-2 leading-relaxed font-sans">
                  The threat matrix weights active weather warnings and unions to dynamically adjust holding cost multipliers.
                </p>
              </div>

              {/* Notification audit log */}
              <div className="mt-2 space-y-2">
                <span className="text-[9.5px] text-slate-500 font-mono uppercase block tracking-wider">Historical Mitigation Runs</span>
                <div className="p-2.5 rounded-xl text-[10.5px] text-slate-400 bg-white/[0.01] border border-white/5 flex items-center justify-between font-mono">
                  <span>Resolved alerts:</span>
                  <span className="text-white font-bold">{dismissedCount + 1} runs</span>
                </div>
              </div>

            </div>

            {/* Simulated test button */}
            <div className="mt-6 pt-3 border-t border-white/5">
              <div className="text-[10.5px] text-slate-500 text-center leading-normal">
                Sensing stream connected via AWS Iot Core & MarineTraffic feeds.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
