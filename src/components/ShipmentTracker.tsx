import React, { useState, useMemo } from "react";
import { Search, Filter, Ship, Plane, Truck, Anchor, CheckCircle, Clock, AlertCircle, Sparkles, Navigation } from "lucide-react";

interface Shipment {
  id: string;
  trackingNo: string;
  carrier: string;
  origin: string;
  destination: string;
  mode: "Ocean" | "Air" | "Road";
  status: "In Transit" | "Arrived" | "Delayed" | "Customs Hold";
  eta: string;
  progress: number;
  cargoValue: number;
  tempSensor: string; // temperature tracking
  humiditySensor: string; // humidity tracking
  incidentReason?: string;
}

const INITIAL_SHIPMENTS: Shipment[] = [
  { id: "SH-4001", trackingNo: "MSK78129045", carrier: "Maersk Line", origin: "Shenzhen Port (SZX)", destination: "Los Angeles Port (LAX)", mode: "Ocean", status: "In Transit", eta: "Jun 19, 2026", progress: 68, cargoValue: 145000, tempSensor: "4.2 °C (Stable)", humiditySensor: "62% RH" },
  { id: "SH-4002", trackingNo: "FEDEX441290", carrier: "FedEx Express", origin: "Rotterdam Hub (RTM)", destination: "New York Gateway (EWR)", mode: "Air", status: "In Transit", eta: "Jun 16, 2026", progress: 85, cargoValue: 320000, tempSensor: "18.5 °C (Ambient)", humiditySensor: "42% RH" },
  { id: "SH-4003", trackingNo: "MSC88102941", carrier: "MSC Logistics", origin: "Shanghai Port (SHA)", destination: "Rotterdam Hub (RTM)", mode: "Ocean", status: "Delayed", eta: "Jun 25, 2026", progress: 42, cargoValue: 89000, tempSensor: "2.1 °C (Stable)", humiditySensor: "68% RH", incidentReason: "Weather anomaly / storm steering" },
  { id: "SH-4004", trackingNo: "DHL99214738", carrier: "DHL Global Forwarding", origin: "Dubai Gateway (DXB)", destination: "Singapore Terminal (SGP)", mode: "Ocean", status: "In Transit", eta: "Jun 29, 2026", progress: 15, cargoValue: 180000, tempSensor: "5.0 °C (Stable)", humiditySensor: "60% RH" },
  { id: "SH-4005", trackingNo: "UPS33104928", carrier: "UPS Freight", origin: "Los Angeles Port (LAX)", destination: "New York Gateway (EWR)", mode: "Road", status: "In Transit", eta: "Jun 18, 2026", progress: 50, cargoValue: 55000, tempSensor: "15.2 °C (Ambient)", humiditySensor: "52% RH" },
  { id: "SH-4006", trackingNo: "ONE29103947", carrier: "Ocean Network Express", origin: "Tokyo Port (TYO)", destination: "Los Angeles Port (LAX)", mode: "Ocean", status: "Arrived", eta: "Jun 14, 2026", progress: 100, cargoValue: 245000, tempSensor: "Cleared", humiditySensor: "Passed" },
  { id: "SH-4007", trackingNo: "CMA90112349", carrier: "CMA CGM Group", origin: "Shenzhen Port (SZX)", destination: "Rotterdam Hub (RTM)", mode: "Ocean", status: "Customs Hold", eta: "Jun 22, 2026", progress: 88, cargoValue: 195000, tempSensor: "7.8 °C (Elevated)", humiditySensor: "71% RH", incidentReason: "Manifest discrepancy review" }
];

export default function ShipmentTracker({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMode, setSelectedMode] = useState<"All" | "Ocean" | "Air" | "Road">("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "In Transit" | "Arrived" | "Delayed" | "Customs Hold">("All");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[2]);

  // Filtering Logic
  const filteredShipments = useMemo(() => {
    return shipments.filter((sh) => {
      const matchSearch = sh.trackingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sh.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sh.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sh.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchMode = selectedMode === "All" || sh.mode === selectedMode;
      const matchStatus = selectedStatus === "All" || sh.status === selectedStatus;

      return matchSearch && matchMode && matchStatus;
    });
  }, [shipments, searchTerm, selectedMode, selectedStatus]);

  const handleAuditRequest = (id: string) => {
    setShipments(prev => prev.map(sh => {
      if (sh.id === id && sh.status === "Customs Hold") {
        // Clear customs simulated re-dispatch
        return {
          ...sh,
          status: "In Transit",
          incidentReason: undefined,
          progress: 90,
          eta: "Jun 17, 2026"
        };
      }
      return sh;
    }));
    // update details if currently highlighted
    if (selectedShipment?.id === id) {
      setSelectedShipment(prev => prev ? {
        ...prev,
        status: "In Transit",
        incidentReason: undefined,
        progress: 90,
        eta: "Jun 17, 2026"
      } : null);
    }
  };

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 relative ${
      isDarkMode 
        ? "bg-slate-900/60 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      
      {isDarkMode && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      )}

      {/* Header bar and filter controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 relative z-10">
        <div>
          <h3 className={`text-base font-semibold font-display ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Real-Time Consolidated Cargo Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-departmental shipping logs capturing multi-modal ETA streams and cold chain sensor feeds.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Text Search */}
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search carrier, tracking, port..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-60 border ${
                isDarkMode ? "bg-black border-white/10 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          {/* Mode select */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as any)}
            className={`text-xs px-3 py-2 rounded-xl focus:outline-none border ${
              isDarkMode ? "bg-black border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="All">All Modes</option>
            <option value="Ocean">Ocean Cargo</option>
            <option value="Air">Air Freight</option>
            <option value="Road">Dry Van Ground</option>
          </select>

          {/* Status select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className={`text-xs px-3 py-2 rounded-xl focus:outline-none border ${
              isDarkMode ? "bg-black border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Delayed">Delayed</option>
            <option value="Customs Hold">Customs Hold</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Grid: Shipments List */}
        <div className="lg:col-span-7 xl:col-span-8 overflow-x-auto">
          {filteredShipments.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border text-slate-500 text-xs font-mono border-dashed ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            }`}>
              No shipments matching active filter parameters.
            </div>
          ) : (
            <div className={`overflow-hidden rounded-2xl border ${
              isDarkMode ? "border-white/5 bg-slate-950/20" : "border-slate-150 bg-slate-50"
            }`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b font-mono uppercase tracking-wider text-[9px] text-slate-400 ${
                    isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-slate-100 border-slate-150"
                  }`}>
                    <th className="px-4 py-3">Carrier / Waybill</th>
                    <th className="px-4 py-3">E2E Routing</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Transit Stream</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[11px]">
                  {filteredShipments.map((sh) => {
                    const isSelected = selectedShipment?.id === sh.id;
                    return (
                      <tr 
                        key={sh.id}
                        onClick={() => setSelectedShipment(sh)}
                        className={`transition-colors cursor-pointer ${
                          isSelected 
                            ? isDarkMode ? "bg-blue-500/10" : "bg-blue-50" 
                            : isDarkMode ? "hover:bg-white/[0.03]" : "hover:bg-slate-100"
                        }`}
                      >
                        {/* Waybill */}
                        <td className="px-4 py-3.5">
                          <div className={`font-mono font-semibold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                            {sh.trackingNo}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{sh.carrier}</div>
                        </td>

                        {/* Routing */}
                        <td className="px-4 py-3.5">
                          <div className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-850"}`}>
                            {sh.destination.split(" - ")[0]}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            From: {sh.origin.split(" - ")[0]}
                          </div>
                        </td>

                        {/* Mode */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-sans font-medium">
                            {sh.mode === "Ocean" ? <Ship className="h-3.5 w-3.5 text-cyan-400" /> :
                             sh.mode === "Air" ? <Plane className="h-3.5 w-3.5 text-blue-400" /> :
                             <Truck className="h-3.5 w-3.5 text-amber-500" />}
                            <span>{sh.mode}</span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full ${
                                sh.status === "Delayed" ? "bg-amber-500" :
                                sh.status === "Customs Hold" ? "bg-red-500" : "bg-emerald-400"
                              }`} style={{ width: `${sh.progress}%` }}></div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 font-semibold">{sh.progress}%</span>
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1 font-mono">ETA: {sh.eta}</div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block border px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                            sh.status === "Arrived" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            sh.status === "Delayed" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse" :
                            sh.status === "Customs Hold" ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" :
                            "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }`}>
                            {sh.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Grid: Detailed Container Readout */}
        <div className="lg:col-span-5 xl:col-span-4">
          {selectedShipment ? (
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200"
            } flex flex-col justify-between h-full`}>
              
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-widest">
                    Container Telemetry Feed
                  </span>
                  <span className="text-slate-400 text-xs font-mono font-bold">
                    {selectedShipment.id}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isDarkMode ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"
                  }`}>
                    {selectedShipment.mode === "Ocean" ? <Ship className="h-5 w-5 text-cyan-400" /> :
                     selectedShipment.mode === "Air" ? <Plane className="h-5 w-5 text-blue-400" /> :
                     <Truck className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div>
                    <h4 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      {selectedShipment.carrier}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Bill of Lading: {selectedShipment.trackingNo}
                    </p>
                  </div>
                </div>

                {/* Tracking Progress Node Chain */}
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <div className="text-left w-24">
                      <span className="text-slate-400 block font-mono">Origin</span>
                      <span className="text-white block font-semibold truncate text-[10px]">{selectedShipment.origin}</span>
                    </div>

                    <div className="flex-grow flex items-center justify-center p-1.5 relative">
                      <div className="w-full bg-slate-800 h-0.5 absolute"></div>
                      <div className="relative z-10 p-0.5 bg-blue-600 rounded-full animate-bounce">
                        <Navigation className="h-3.5 w-3.5 text-white transform rotate-45" />
                      </div>
                    </div>

                    <div className="text-right w-24">
                      <span className="text-slate-400 block font-mono">Destination</span>
                      <span className="text-white block font-semibold truncate text-[10px]">{selectedShipment.destination}</span>
                    </div>
                  </div>

                  {/* Environment metrics: critical cold-chain tracking! */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className={`p-2 rounded-xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-white border-slate-200"}`}>
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Container Temp</span>
                      <span className={`text-[11.5px] font-bold block mt-0.5 ${
                        selectedShipment.status === "Customs Hold" ? "text-red-400" : "text-white"
                      }`}>
                        {selectedShipment.tempSensor}
                      </span>
                    </div>
                    <div className={`p-2 rounded-xl border ${isDarkMode ? "bg-white/[0.01] border-white/5" : "bg-white border-slate-200"}`}>
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Humidity Gauge</span>
                      <span className="text-[11.5px] font-semibold text-white block mt-0.5">
                        {selectedShipment.humiditySensor}
                      </span>
                    </div>
                  </div>

                  {/* Financials on Transit Value */}
                  <div className="mt-3 leading-snug">
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Insured Assets Valuation</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono block mt-0.5">
                      ${selectedShipment.cargoValue.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Reroute or Dispatch Actions */}
                {selectedShipment.incidentReason && (
                  <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10.5px]">
                    <div className="flex items-start gap-1.5 text-amber-400 font-semibold mb-1">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Issue: {selectedShipment.status}</span>
                    </div>
                    <p className="text-slate-350 leading-relaxed font-sans">{selectedShipment.incidentReason}</p>
                  </div>
                )}

              </div>

              {/* Resolution triggers for simulation */}
              <div className="mt-6 pt-3 border-t border-white/5">
                {selectedShipment.status === "Customs Hold" ? (
                  <button
                    onClick={() => handleAuditRequest(selectedShipment.id)}
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1 shadow-md shadow-blue-600/15"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Automate Customs Clearance Payload
                  </button>
                ) : selectedShipment.status === "Delayed" ? (
                  <div className="text-[10px] text-amber-500 flex items-center justify-center gap-1.5 p-1">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>Automatic Rerouting Payload dispatching in next epoch.</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 p-1 font-mono">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Shipment telemetry normal. Tracking SLA maintained.</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className={`p-5 rounded-2xl border text-slate-500 text-center flex items-center justify-center h-full border-dashed ${
              isDarkMode ? "bg-slate-950/20 border-white/10" : "bg-slate-50 border-slate-200"
            }`}>
              Select an inter-continental cargo log on the table to access real-time temperature, tracking nodes, and custom clearances.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
