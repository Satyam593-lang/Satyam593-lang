import React, { useState, useMemo, useEffect } from "react";
import { SKUItem, ForecastConfig, UserSession, UserRole } from "./types";
import { INITIAL_SKUS, computeAllMetrics, computeItemMetrics, convertToCSV, generateMonthLabels } from "./utils";
import LoginPortal from "./components/LoginPortal";
import KPICards from "./components/KPICards";
import ForecastSelector from "./components/ForecastSelector";
import SKUTable from "./components/SKUTable";
import PivotGraphs from "./components/PivotGraphs";
import AIInsightsTab from "./components/AIInsightsTab";
import PrintPDFReport from "./components/PrintPDFReport";

// New modules
import InteractiveMap from "./components/InteractiveMap";
import ShipmentTracker from "./components/ShipmentTracker";
import WarehousePerformance from "./components/WarehousePerformance";
import RiskAlertsCenter from "./components/RiskAlertsCenter";
import ScenarioSimulator, { ScenarioID } from "./components/ScenarioSimulator";
import SustainabilityTracker from "./components/SustainabilityTracker";
import SupplierScorecard from "./components/SupplierScorecard";
import ExecutiveSummary from "./components/ExecutiveSummary";
import AIChatbot from "./components/AIChatbot";

import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  LogOut,
  Sliders,
  Database,
  Brain,
  FileSpreadsheet,
  Printer,
  User,
  Activity,
  UserCheck,
  Package,
  Globe,
  Compass,
  LayoutDashboard,
  Moon,
  Sun,
  Layers,
  Sparkles
} from "lucide-react";

const DEFAULT_CONFIG: ForecastConfig = {
  method: "SMA",
  horizon: 3,
  smaPeriod: 3,
  alpha: 0.3,
  leadTimeDefault: 10,
  carryingCostRateDefault: 20,
  setupCostDefault: 40,
};

type ActiveNavTab = "executive" | "fleet" | "forecasting" | "catalog" | "advisory";

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeScenario, setActiveScenario] = useState<ScenarioID>("baseline");
  
  // Forecast parameters state
  const [config, setConfig] = useState<ForecastConfig>(DEFAULT_CONFIG);
  
  // Custom SKU state populated with raw entries
  const [items, setItems] = useState<SKUItem[]>(() => 
    computeAllMetrics(INITIAL_SKUS, DEFAULT_CONFIG)
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>("executive");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Recompute calculations when active scenario or config sliders change
  const adjustedItems = useMemo(() => {
    let modifiedItems = INITIAL_SKUS.map(item => {
      // Create deep clone helper to avoid mutability flags
      return { ...item, history: [...item.history], historyLabels: [...item.historyLabels] };
    });

    if (activeScenario === "suez") {
      modifiedItems = modifiedItems.map(item => ({
        ...item,
        leadTime: item.leadTime + 12, // adding shipping latency
        setupCost: item.setupCost + 15 // addition transit fuel expenses
      }));
    } else if (activeScenario === "promo") {
      modifiedItems = modifiedItems.map(item => ({
        ...item,
        history: item.history.map(qty => Math.round(qty * 1.5)) // 50% seasonal demand jump
      }));
    } else if (activeScenario === "inflation") {
      modifiedItems = modifiedItems.map(item => ({
        ...item,
        holdingCostRate: (item.holdingCostRate || 0.20) * 2.0 // doubled interest rate surcharge
      }));
    }

    return computeAllMetrics(modifiedItems, config);
  }, [config, activeScenario]);

  // Sync state modifications smoothly
  useEffect(() => {
    setItems(adjustedItems);
  }, [adjustedItems]);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  const handleUpdateSKU = (skuId: string, updatedFields: Partial<SKUItem>) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === skuId) {
          const merged = { ...item, ...updatedFields };
          return computeItemMetrics(merged, config);
        }
        return item;
      });
    });
  };

  const handleBulkImport = (importedItems: SKUItem[]) => {
    const enriched = computeAllMetrics(importedItems, config);
    setItems(enriched);
    setSelectedItemId(null);
  };

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return items.find((i) => i.id === selectedItemId) || null;
  }, [items, selectedItemId]);

  const handleDownloadExcel = () => {
    try {
      const csvStr = convertToCSV(items);
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `logicast_control_tower_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("CSV download error:", e);
    }
  };

  const handleApplySafetyOffset = (percentage: number) => {
    // Increase lead time universally slightly to establish safe inventory buffers
    setConfig(prev => ({
      ...prev,
      leadTimeDefault: prev.leadTimeDefault + Math.round(percentage / 10)
    }));
  };

  const currentMonthDisplay = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (!session) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans relative antialiased leading-normal transition-colors duration-300 ${
      isDarkMode ? "bg-[#060713] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* 1. Main visual application interface */}
      <div className="flex-grow flex flex-col print:hidden z-10">
        
        {/* Modern Header Navigation */}
        <header className={`px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
          isDarkMode ? "bg-[#080918]/80 border-white/10" : "bg-white/90 border-slate-200"
        }`}>
          
          {/* Logo Identity with active status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="h-5.5 w-5.5 text-white -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-display font-black text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  LogiCast Control Tower
                </span>
                <span className="text-[9px] font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-blue-400 font-bold uppercase tracking-wider">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Operations: {currentMonthDisplay}</p>
            </div>
          </div>

          {/* Navigation Control Modules */}
          <nav className={`flex flex-wrap items-center p-1 rounded-2xl border ${
            isDarkMode ? "bg-black/40 border-white/5" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setActiveTab("executive")}
              id="tab-btn-executive"
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === "executive"
                  ? isDarkMode ? "bg-white/10 text-white shadow" : "bg-white text-blue-600 shadow border border-slate-200"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Executive Command
            </button>

            <button
              onClick={() => setActiveTab("fleet")}
              id="tab-btn-fleet"
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === "fleet"
                  ? isDarkMode ? "bg-white/10 text-white shadow" : "bg-white text-blue-600 shadow border border-slate-200"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <Globe className="h-4 w-4" />
              Transit & Logistics
            </button>

            <button
              onClick={() => setActiveTab("forecasting")}
              id="tab-btn-forecasting"
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === "forecasting"
                  ? isDarkMode ? "bg-white/10 text-white shadow" : "bg-white text-blue-600 shadow border border-slate-200"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <Activity className="h-4 w-4" />
              Demand Forecasting
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              id="tab-btn-catalog"
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === "catalog"
                  ? isDarkMode ? "bg-white/10 text-white shadow" : "bg-white text-blue-600 shadow border border-slate-200"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <Database className="h-4 w-4" />
              SKU Planner
            </button>

            <button
              onClick={() => setActiveTab("advisory")}
              id="tab-btn-advisory"
              className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === "advisory"
                  ? isDarkMode ? "bg-white/10 text-white shadow" : "bg-white text-blue-600 shadow border border-slate-200"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              Gemini Advisor
            </button>
          </nav>

          {/* Settings & Profile Actions */}
          <div className="flex items-center gap-3">
            {/* Dark & light mode Toggle Switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              id="theme-toggle-btn"
              type="button"
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode ? "bg-[#0c0d21] border-white/5 text-amber-400 hover:text-amber-300" : "bg-white border-slate-200 text-slate-705 hover:bg-slate-100"
              }`}
              title="Toggle Contrast Mode"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Profile badge with SAML Department */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              isDarkMode ? "bg-[#0b0c1b] border-white/5" : "bg-white border-slate-200"
            }`}>
              <div className="bg-blue-600/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-400 text-sm border border-blue-500/20">
                {session.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className={`text-xs font-bold block ${isDarkMode ? "text-white" : "text-slate-850"}`}>{session.fullName}</span>
                <span className="text-[9.5px] text-slate-500 block font-mono">{session.role} • {session.department}</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              id="logout-btn"
              type="button"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDarkMode ? "bg-white/5 border-white/5 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              title="Sign Out Session"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>

        </header>

        {/* Global Action HUD Indicator */}
        <div className={`px-6 py-2.5 border-b flex flex-col md:flex-row justify-between items-center gap-3 text-xs ${
          isDarkMode ? "bg-[#090a16] border-white/[0.04]" : "bg-slate-100/60 border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-450 font-mono text-[11px]">
              Sensing: <strong className={isDarkMode ? "text-white" : "text-slate-800"}>{items.length} dynamic SKU records</strong> active • Target accuracy: <strong className="text-emerald-400">94.2%</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExcel}
              id="export-csv-btn"
              type="button"
              className={`text-xs border rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                isDarkMode ? "text-slate-300 hover:text-white bg-white/5 border-white/5" : "text-slate-650 bg-white border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-slate-400" />
              Export CSV
            </button>
            
            <button
              onClick={() => window.print()}
              id="trigger-print-btn"
              type="button"
              className="text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer shadow border border-blue-500 leading-none font-semibold"
            >
              <Printer className="h-4 w-4" />
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Dynamic Nav View Render */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 space-y-8 select-text">
          
          {/* Active Scenario Warning Indicator */}
          {activeScenario !== "baseline" && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed animate-fade-in relative z-20">
              <Compass className="h-5 w-5 shrink-0 animate-spin text-amber-400" />
              <div>
                <span className="font-bold text-white block">Active Sandbox Simulator Offset: &quot;{activeScenario}&quot;</span>
                <span className="text-[11px] block mt-0.5 text-slate-400">
                  Every calculation, ROP threshold, holding drag multiplier, and forecast line is altered in real-time. Turn off the What-If simulation below to return to actual historical metrics.
                </span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* EXECUTIVE Command Tab */}
            {activeTab === "executive" && (
              <motion.div
                key="executive-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* 1. Six Executive KPI cards */}
                <KPICards items={items} isDarkMode={isDarkMode} />

                {/* 2. Executive Analytics Summary */}
                <ExecutiveSummary 
                  isDarkMode={isDarkMode} 
                  items={items} 
                  config={config} 
                  activeScenario={activeScenario} 
                />

                {/* 3. Scenario Planner Simulator */}
                <ScenarioSimulator 
                  isDarkMode={isDarkMode} 
                  activeScenario={activeScenario} 
                  onChangeScenario={setActiveScenario} 
                />

                {/* 4. Threat alerts system */}
                <RiskAlertsCenter 
                  isDarkMode={isDarkMode} 
                  onApplySafetyOffset={handleApplySafetyOffset} 
                />

                {/* Grid of Sustainability & Suppliers */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <SustainabilityTracker isDarkMode={isDarkMode} totalSKUs={items.length} />
                  <SupplierScorecard isDarkMode={isDarkMode} />
                </div>
              </motion.div>
            )}

            {/* FLEET & Transit routing Tab */}
            {activeTab === "fleet" && (
              <motion.div
                key="fleet-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* 1. Global Interactive Map */}
                <InteractiveMap isDarkMode={isDarkMode} />

                {/* 2. Real-Time Shipment Tracker */}
                <ShipmentTracker isDarkMode={isDarkMode} />

                {/* 3. Warehouse diagnostics */}
                <WarehousePerformance isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {/* DEMAND FORECASTING Tab */}
            {activeTab === "forecasting" && (
              <motion.div
                key="forecasting-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* 1. Forecasting config sliders */}
                <ForecastSelector
                  config={config}
                  onChange={setConfig}
                  canEdit={session.role === "Director" || session.role === "Planner"}
                  isDarkMode={isDarkMode}
                />

                {/* 2. Forecasting graphs */}
                <PivotGraphs items={items} selectedItem={selectedItem} isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {/* SKU PLANNER Table Tab */}
            {activeTab === "catalog" && (
              <motion.div
                key="catalog-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* SKU Catalog Table with uploads */}
                <SKUTable
                  items={items}
                  onUpdateSKU={handleUpdateSKU}
                  onBulkImport={handleBulkImport}
                  session={session}
                  selectedItemId={selectedItemId}
                  onSelectItem={setSelectedItemId}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            )}

            {/* AI ADVISORY Board Tab */}
            {activeTab === "advisory" && (
              <motion.div
                key="advisory-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Gemini AI advisor */}
                <AIInsightsTab
                  items={items}
                  selectedItem={selectedItem}
                  session={session}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            )}

          </AnimatePresence>

        </main>

        {/* Footer info branding */}
        <footer className={`border-t py-6 px-6 text-center text-[10.5px] font-mono flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors ${
          isDarkMode ? "border-white/5 bg-black/40 text-slate-500" : "border-slate-200 bg-white text-slate-600"
        }`}>
          <span>Sovereign Control Tower Systems • Real-time Time-series Demand Planning</span>
          <div className="flex gap-4">
            <span>Client: {session.username}-Active</span>
            <span>PORT 3000 Node</span>
          </div>
        </footer>

      </div>

      {/* Floating AI chat drawer (Always accessible on all pages) */}
      <AIChatbot 
        items={items} 
        activeScenario={activeScenario} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(!isChatOpen)} 
        isDarkMode={isDarkMode}
      />

      {/* 2. Hidden Layout for high fidelity PDF outputting */}
      <PrintPDFReport items={items} config={config} insights={null} />

    </div>
  );
}
