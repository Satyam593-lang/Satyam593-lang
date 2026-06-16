import React from "react";
import { UserCheck, HelpCircle, Star, ThumbsUp, ShieldAlert, BadgeCheck, CheckCircle } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  category: string;
  otif: number; // On-time, In-Full percentage (e.g., 98.4)
  defectRate: number; // percentage (e.g., 0.12)
  leadTimeConsistency: string; // e.g. "Excellent (+/- 1d)"
  billingAccuracy: number; // percentage (e.g., 99.8)
  partnerClass: "Strategic Partner" | "Standard Supplier" | "Under Review";
}

const SUPPLIERS: Supplier[] = [
  {
    id: "SUP-101",
    name: "ElectroTech Holdings",
    category: "Electronics",
    otif: 98.4,
    defectRate: 0.12,
    leadTimeConsistency: "Excellent (+/- 1d)",
    billingAccuracy: 99.8,
    partnerClass: "Strategic Partner"
  },
  {
    id: "SUP-102",
    name: "Summit Apparel Co.",
    category: "Apparel",
    otif: 94.2,
    defectRate: 0.45,
    leadTimeConsistency: "Acceptable (+/- 2d)",
    billingAccuracy: 98.5,
    partnerClass: "Standard Supplier"
  },
  {
    id: "SUP-103",
    name: "BioVite Organic Labs",
    category: "Groceries",
    otif: 99.1,
    defectRate: 0.05,
    leadTimeConsistency: "Pristine (+/- 0d)",
    billingAccuracy: 100.0,
    partnerClass: "Strategic Partner"
  },
  {
    id: "SUP-104",
    name: "ErgoForm Office seating",
    category: "Office",
    otif: 82.5,
    defectRate: 1.85,
    leadTimeConsistency: "Erratic (+/- 5d)",
    billingAccuracy: 94.1,
    partnerClass: "Under Review"
  }
];

export default function SupplierScorecard({ isDarkMode = true }: { isDarkMode?: boolean }) {
  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-blue-400" />
            <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Supplier Performance Scorecard
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Vendor SLAs tracking on-time-in-full delivery (OTIF), incoming QA defect ratios, and billing precision.
          </p>
        </div>

        <div className="flex gap-2 text-[10px] font-mono">
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Partner Standard: 95% +</span>
        </div>
      </div>

      {/* Scorecard Table / Grid */}
      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Supplier List Grid */}
        <div className="lg:col-span-8 overflow-x-auto">
          <div className={`overflow-hidden rounded-2xl border ${
            isDarkMode ? "border-white/5 bg-slate-950/20" : "border-slate-150 bg-slate-50"
          }`}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b font-mono uppercase tracking-wider text-[9px] text-slate-400 ${
                  isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-100 border-slate-150"
                }`}>
                  <th className="px-4 py-3">Supplier Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">OTIF Rate</th>
                  <th className="px-4 py-3">Defect Ratio</th>
                  <th className="px-4 py-3 text-center">Assigned Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[11px]">
                {SUPPLIERS.map((sup) => {
                  let subClassBadge = "bg-blue-500/10 text-blue-400 border border-blue-500/10";
                  if (sup.partnerClass === "Strategic Partner") subClassBadge = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  if (sup.partnerClass === "Under Review") subClassBadge = "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse";

                  return (
                    <tr key={sup.id} className={isDarkMode ? "hover:bg-white/[0.02] transition-colors" : "hover:bg-slate-100 transition-colors"}>
                      <td className="px-4 py-3.5">
                        <div className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{sup.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sup.id}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-slate-300 font-medium">{sup.category}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${
                            sup.otif >= 95 ? "text-emerald-400" : sup.otif >= 90 ? "text-amber-500" : "text-red-400"
                          }`}>{sup.otif}%</span>
                          <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className={`h-full ${
                              sup.otif >= 95 ? "bg-emerald-400" : sup.otif >= 90 ? "bg-amber-500" : "bg-red-500"
                            }`} style={{ width: `${sup.otif}%` }}></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`font-mono ${sup.defectRate <= 0.2 ? "text-emerald-400" : "text-amber-450"}`}>
                          {sup.defectRate}%
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${subClassBadge}`}>
                          {sup.partnerClass}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: KPI Score Details */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
          } flex flex-col justify-between h-full`}>
            
            <div>
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">
                  Supplier Quality Metrics
                </span>
              </div>

              {/* Vendor rating metrics */}
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[9px]">Mean Lead Consistency</span>
                  <span className="text-white block font-semibold text-[13px] mt-0.5">⏱️ +/- 1.25 Days variance</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[9px]">Billing Precision</span>
                  <span className="text-white block font-semibold text-[13px] mt-0.5">🧾 98.8% Invoice Accord</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[9px]">Carbon Intensity Surcharges</span>
                  <span className="text-white block font-semibold text-[13px] mt-0.5">🌱 Compliant with LEED v4</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10.5px]">
                <div className="flex items-start gap-1.5 text-blue-400 font-semibold mb-1">
                  <BadgeCheck className="h-4 w-4 shrink-0" />
                  <span>Strategic Rebalancing Advice</span>
                </div>
                <p className="text-slate-350 leading-relaxed">
                  Supplier <strong>SUP-104 (ErgoForm)</strong> is under review. Consider shifting Office Category EOQs towards spot orders with secondary suppliers until SLA compliance registers above 90%.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/5 text-[9.5px] text-slate-500 leading-normal font-sans text-center">
              Audits conducted monthly by Procurement Core.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
