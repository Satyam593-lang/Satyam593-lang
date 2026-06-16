import React, { useState } from "react";
import { UserSession, UserRole } from "../types";
import { Lock, Truck, Shield, User, Info, ArrowRight, Sparkles, Ship, Plane, Layers, Box, Globe, Activity } from "lucide-react";

interface LoginPortalProps {
  onLoginSuccess: (session: UserSession) => void;
}

const DEMO_PRESETS = [
  {
    username: "director_sara",
    fullName: "Sara Chen",
    role: "Director" as UserRole,
    department: "Executive Logistics",
    permissions: ["view_all", "edit_config", "edit_inventory", "ai_trigger", "export_all"],
    desc: "Complete command of financial KPIs, scenario sandbox planning, and AI advisor metrics."
  },
  {
    username: "planner_marcus",
    fullName: "Marcus Wade",
    role: "Planner" as UserRole,
    department: "Demand Planning",
    permissions: ["view_all", "edit_config", "ai_trigger"],
    desc: "Override time-series demand models, adjust exp coefficients, and review warehouse logs."
  },
  {
    username: "manager_dave",
    fullName: "Dave Miller",
    role: "Logistics" as UserRole,
    department: "Warehouse Operations",
    permissions: ["view_all", "edit_inventory"],
    desc: "Refine actual on-hand stock quantities, cold thermal thresholds, and track ocean shipments."
  },
  {
    username: "guest_investor",
    fullName: "James Stirling",
    role: "Guest" as UserRole,
    department: "Advisory Board",
    permissions: ["view_all"],
    desc: "Read-only access to forecasting charts, sustainability footprinting, and vendor OTIF metrics."
  }
];

export default function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setErrorMsg("Please provide a valid username");
      return;
    }

    const matched = DEMO_PRESETS.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (matched) {
      onLoginSuccess({
        username: matched.username,
        role: matched.role,
        fullName: matched.fullName,
        department: matched.department,
        permissions: matched.permissions
      });
    } else {
      onLoginSuccess({
        username: username,
        role: "Planner" as UserRole,
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
        department: "Global Supply",
        permissions: ["view_all", "edit_config"]
      });
    }
  };

  const handlePresetSelect = (preset: typeof DEMO_PRESETS[0]) => {
    onLoginSuccess({
      username: preset.username,
      role: preset.role,
      fullName: preset.fullName,
      department: preset.department,
      permissions: preset.permissions
    });
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Background Animated Logistics Grid Particles */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Floating Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 translate-y-1/2"></div>

      {/* Hero Welcome Container */}
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Brand/Hero Panel with floating vectors and active supply chain visualization */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#111422] to-black rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-blue-500/10 overflow-hidden relative">
          
          {/* Internal gradient mesh card design */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

          <div>
            {/* Identity logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600/20 p-2.5 rounded-2xl border border-blue-500/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white block">LogiCast Tower</span>
                <span className="text-[9px] text-blue-400 font-mono tracking-wider block">ENTERPRISE INTELLIGENCE SYSTEM</span>
              </div>
            </div>

            <h1 className="text-3xl font-display font-medium tracking-tight text-white leading-tight mb-4">
              The Sovereign <span className="text-blue-400">Control Tower</span> for Global Supply Chain Visibility
            </h1>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
              LogiCast is a next-generation predictive modeling suite incorporating real-time time-series modeling, automated safety stock calculation, EOQ optimization, and direct Gemini AI-based advisory interfaces.
            </p>

            {/* Simulated Animated Network Grid map */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl relative overflow-hidden group mb-6 select-none shadow">
              <div className="text-[8.5px] font-mono text-slate-500 flex justify-between uppercase mb-2">
                <span>Fleet Telemetry</span>
                <span className="text-emerald-400 animate-pulse">● SEN_OK</span>
              </div>
              
              {/* Dynamic Icons animating inside dashboard */}
              <div className="relative h-20 w-full rounded bg-[#0b0c16] flex items-center justify-around border border-white/[0.02]">
                <div className="flex flex-col items-center">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400 border border-blue-500/20 animate-bounce">
                    <Ship className="h-4 w-4" />
                  </div>
                  <span className="text-[8.5px] font-mono text-slate-500 mt-1">Cargo-019</span>
                </div>
                <div className="w-8 border-t border-dashed border-slate-700"></div>
                <div className="flex flex-col items-center">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Layers className="h-4 w-4 animate-pulse" />
                  </div>
                  <span className="text-[8.5px] font-mono text-slate-500 mt-1">Atlanta Hub</span>
                </div>
                <div className="w-8 border-t border-dashed border-slate-700"></div>
                <div className="flex flex-col items-center">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-bounce [animation-delay:0.5s]">
                    <Plane className="h-4 w-4" />
                  </div>
                  <span className="text-[8.5px] font-mono text-slate-500 mt-1">Atlas Jet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6">
            <div className="flex gap-3 items-start text-xs text-slate-400 leading-relaxed font-sans">
              <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-200">Corporate Single Sign-On Ready</span>
                <span>Role-based credentials automatically limit write parameters for Director, Planner, and Operational roles.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Panel - Entry Profiles & Manual Form */}
        <div className="lg:col-span-7 bg-white/[0.03] rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
          
          <div>
            <h2 className="text-2xl font-light font-display text-white mb-2">Workspace Access</h2>
            <p className="text-xs text-slate-400 mb-6 font-sans">
              Select an enterprise testing profile below to populate context or authenticate custom credentials.
            </p>

            {/* Presets Grid */}
            <div className="mb-8">
              <span className="text-[10px] uppercase font-mono tracking-wider block mb-3 text-slate-500">
                Quick-Access Enterprise Profiles
              </span>
              
              <div className="grid sm:grid-cols-2 gap-3.5">
                {DEMO_PRESETS.map((p) => {
                  let roleColor = "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
                  if (p.role === "Director") roleColor = "border-blue-500/20 bg-blue-500/5 text-blue-400";
                  if (p.role === "Planner") roleColor = "border-amber-500/20 bg-amber-500/5 text-amber-500";
                  if (p.role === "Guest") roleColor = "border-white/10 bg-white/5 text-slate-400";

                  return (
                    <button
                      key={p.username}
                      onClick={() => handlePresetSelect(p)}
                      id={`profile-btn-${p.username}`}
                      type="button"
                      className="group text-left p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-blue-500/40 transition-all duration-200 cursor-pointer self-stretch flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors font-sans">
                          {p.fullName}
                        </span>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${roleColor}`}>
                          {p.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="relative flex py-4 items-center select-none">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">or login manually</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Manual Credential form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-xs flex items-center gap-2 font-mono">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-medium text-slate-400 mb-1.5 uppercase font-mono tracking-wider">
                    Username / Member ID
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="custom_username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      id="login-username-input"
                      className="block w-full rounded-xl bg-black/50 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-medium text-slate-400 mb-1.5 uppercase font-mono tracking-wider">
                    SAML Password (Optional)
                  </label>
                  <div className="relative font-mono">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="login-password-input"
                      className="block w-full rounded-xl bg-black/50 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl py-3 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10 border border-blue-500 hover:scale-[1.01]"
              >
                Launch Intelligence Console
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

          </div>

          <div className="border-t border-white/5 pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 font-mono select-none">
            <span>Powered by Gemini 3.5-flash AI Platform</span>
            <span>Firmware V5.2.1 • Stable Release</span>
          </div>

        </div>

      </div>
    </div>
  );
}
