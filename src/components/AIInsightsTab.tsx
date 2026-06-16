import React, { useState, useEffect } from "react";
import { SKUItem, UserSession } from "../types";
import { Sparkles, BrainCircuit, RefreshCw, Send, FileText, CheckCircle, Flame, ShieldCheck } from "lucide-react";
import Markdown from "react-markdown";

interface AIInsightsTabProps {
  items: SKUItem[];
  selectedItem: SKUItem | null;
  session: UserSession;
  isDarkMode?: boolean;
}

const ANALYZING_STAGES = [
  "Reading SKU dataset metrics...",
  "Evaluating warehouse carrying cost parameters (H)...",
  "Assessing lead-time variance risks...",
  "Running predictive overstock diagnostics...",
  "Consulting LogiCast Demand Sensing matrix...",
  "Compiling executive logistics response...",
];

export default function AIInsightsTab({ items, selectedItem, session, isDarkMode = true }: AIInsightsTabProps) {
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [insights, setInsights] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % ANALYZING_STAGES.length);
      }, 3500);
    } else {
      setStageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const canTriggerAI = session.role === "Director" || session.role === "Planner";

  const triggerGeminiRequest = async () => {
    if (!canTriggerAI) return;
    setLoading(true);
    setErrorMsg(null);
    setInsights(null);

    const stockouts = items.filter((i) => i.status === "Stockout Risk").length;
    const overstocks = items.filter((i) => i.status === "Overstock").length;
    const totalStock = items.reduce((sum, i) => sum + i.currentStock, 0);

    const dataSummary = {
      totalItems: items.length,
      totalStock,
      stockouts,
      overstocks,
      category: items.map((i) => i.category).filter((v, i, self) => self.indexOf(v) === i).join(", "),
    };

    try {
      const response = await fetch("/api/forecast-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          datasetSummary: dataSummary,
          analysisRequest: {
            singleItem: selectedItem ? selectedItem : null,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Error communicating with server advisory channel");
      }

      const data = await response.json();
      setInsights(data.insights || "No response received.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to trigger demand sensing advisor.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDemoPreBakedReport = () => {
    setInsights(`
### LOGICAST EXECUTIVE FORECAST ADVISORY REPORT

**Status**: Ready
**Target Catalog**: General SKU Portfolio (${items.length} Items Active)
**Primary Categories**: Electronics, Apparel, Home & Kitchen, Groceries, Office, Industrial
**Target Model Configuration**: SMA-3 / Holt-Winters Exponential

---

#### 1. Core Portfolio Analysis & Financial Health
Across the catalog, you have a total stock on hand of **${items.reduce((sum, i)=>sum+i.currentStock,0).toLocaleString()} units** with a combined capital value of **$${items.reduce((sum, i)=>sum+(i.currentStock*i.price),0).toLocaleString("en-US", {maximumFractionDigits:0})}**.
Currently, carrying costs represent a combined capital drag of approximately **20% annually**. 

* **Excessive Holding Drag**: Slow-mover **Cotton T-Shirt (SKU-102)** is carrying over 2,400 units, representing significant tied capital that is declining in velocity.
* **Fulfillment Risks**: **Smart Watch Active (SKU-106)** is down to 12 units on-hand, which is significantly below its reorder trigger point of 51 units. You are facing a localized block on electronic line revenues within 8 days if reordering is delayed.

#### 2. Optimization Strategy (Economic Order Quantities)
* **Bento Containers (SKU-103)**: Demand averages 330 units monthly with high standard deviation. Ordering in larger batches optimizations setup vs carrying weights.
* **Ergonomic Chairs (SKU-105)**: With long lead times (21 days) and high prices, establish safety buffers to prevent order delays from freezing enterprise accounts.

---

### AI ACTIONABLE PLAYBOOK
1. **Reduce Overstocks**: Initiate seasonal markdown campaigns for Cotton T-Shirts. Run a 15% promotional drive.
2. **Issue Emergency POs**: Place instant replacement procurement for active Electronics segments, specifically **SKU-106 (Smart Watch)**.
3. **Consolidate Warehouse Space**: Relocate slow components towards the back, and advance high-volatility items with short lead times like modern Groceries to high-access picking zones.
`);
  };

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative z-10 ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-slate-100" 
        : "bg-white border-slate-200 shadow-xl text-slate-800"
    }`}>
      
      {/* Tab Header bar */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 mb-6 ${
        isDarkMode ? "border-white/10" : "border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-2xl border border-blue-500/25">
            <Sparkles className="h-5.5 w-5.5 text-blue-400" />
          </div>
          <div>
            <h3 className={`text-base font-semibold tracking-tight flex items-center gap-2 font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Gemini Demand Advisory Board
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Leverage advanced intelligence to discover capital leaks, seasonal shifts, and stockout remedies.
            </p>
          </div>
        </div>

        {canTriggerAI ? (
          <button
            onClick={triggerGeminiRequest}
            disabled={loading}
            type="button"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/15 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
            ) : (
              <BrainCircuit className="h-4.5 w-4.5" />
            )}
            Sense Demand & Run AI Advisor
          </button>
        ) : (
          <div className={`text-[11px] border px-3 py-2 rounded-xl flex items-center gap-1.5 leading-normal max-w-sm ${
            isDarkMode ? "text-amber-400 bg-black/30 border-white/10" : "text-amber-700 bg-amber-50 border-amber-200"
          }`}>
            <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
            <span>AI Actions limited. Access reserved for Demand Planners and Supply Directors.</span>
          </div>
        )}
      </div>

      {/* Main Panel View */}
      {loading ? (
        <div className="py-20 flex flex-col justify-center items-center text-center space-y-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin"></div>
            <Sparkles className="h-6 w-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-300 block mb-1">
              LogiCast Advisory is analyzing...
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wide block transition-all">
              {ANALYZING_STAGES[stageIndex]}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Integrating your current SMA/EMA predictions with historical variances to design capital reallocation tactics.
          </p>
        </div>
      ) : errorMsg ? (
        <div className={`p-5 border rounded-2xl space-y-3 max-w-2xl mx-auto ${
          isDarkMode ? "bg-red-500/10 border-red-500/25 text-red-100" : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex gap-2.5 text-xs font-semibold items-center">
            <Flame className="h-4.5 w-4.5" />
            <span>Advisory Connection Interrupted</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorMsg}
          </p>
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={triggerGeminiRequest}
              type="button"
              className="text-xs text-white bg-red-650 hover:bg-red-600 px-3 py-1.5 rounded-xl transition-all cursor-pointer border shadow"
            >
              Retry Connection
            </button>
            <button
              onClick={triggerDemoPreBakedReport}
              type="button"
              className={`text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                isDarkMode ? "text-blue-300 hover:text-white bg-blue-500/15 border-blue-500/10" : "text-blue-650 bg-blue-50 border-blue-105"
              }`}
            >
              Simulate Core AI Advisory Draft
            </button>
          </div>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          <div className={`flex justify-between items-center p-4 rounded-xl border mb-4 text-xs ${
            isDarkMode ? "bg-blue-500/5 border-blue-500/10 text-blue-350" : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Report Compiled Successfully (Gemini 3.5-flash)</span>
            </div>
            {selectedItem && (
              <span className="font-mono font-semibold text-blue-450">Focus: {selectedItem.sku}</span>
            )}
          </div>

          {/* Styled Markdown block */}
          <div className={`prose max-w-none text-xs sm:text-sm leading-relaxed space-y-4 ${
            isDarkMode ? "prose-invert text-slate-300" : "text-slate-700"
          }`}>
            <div className="markdown-body">
              <Markdown>{insights}</Markdown>
            </div>
          </div>

          {/* Quick Action Button for printing compiled report */}
          <div className={`border-t pt-6 mt-6 flex justify-end ${
            isDarkMode ? "border-white/10" : "border-slate-200"
          }`}>
            <button
              onClick={() => window.print()}
              type="button"
              className={`text-xs border rounded-xl px-4 py-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                isDarkMode ? "text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border-white/10" : "text-slate-600 bg-slate-50 border-slate-220 hover:bg-slate-100"
              }`}
            >
              <FileText className="h-4 w-4" />
              Export Advisory Pack to PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <BrainCircuit className="h-10 w-10 text-slate-500 mx-auto" />
          <div>
            <span className={`font-semibold block mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>Advisory board ready for simulation</span>
            <span className="text-xs text-slate-400 leading-relaxed block">
              Click &quot;Sense Demand &amp; Run AI Advisor&quot; above to compose an executive report. You can select a SKU from the table to focus Gemini on a deep SKU analysis.
            </span>
          </div>
          <button
            onClick={triggerDemoPreBakedReport}
            type="button"
            className={`text-xs px-3 py-2 rounded-xl transition-all cursor-pointer border ${
              isDarkMode ? "text-blue-300 hover:text-white bg-blue-500/10 border-blue-500/20" : "text-blue-650 bg-blue-50 border-blue-150 hover:bg-blue-100"
            }`}
          >
            Analyze General Portfolio Instantly
          </button>
        </div>
      )}

    </div>
  );
}
