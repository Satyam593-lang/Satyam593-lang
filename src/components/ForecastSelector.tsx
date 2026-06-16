import { ForecastConfig, ForecastMethod } from "../types";
import { Sliders, RefreshCw, Layers } from "lucide-react";

interface ForecastSelectorProps {
  config: ForecastConfig;
  onChange: (newConfig: ForecastConfig) => void;
  canEdit: boolean;
  isDarkMode?: boolean;
}

export default function ForecastSelector({ config, onChange, canEdit, isDarkMode = true }: ForecastSelectorProps) {
  const handleMethodChange = (method: ForecastMethod) => {
    if (!canEdit) return;
    onChange({ ...config, method });
  };

  const handleSliderChange = (key: keyof ForecastConfig, val: number) => {
    if (!canEdit) return;
    onChange({ ...config, [key]: val });
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <Sliders className="h-4.5 w-4.5 text-blue-400" />
        <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-display">Forecasting Engine & Operational Setup</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Method Picker */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
            Time-Series Algorithm
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["SMA", "EMA", "LINEAR"] as ForecastMethod[]).map((m) => {
              const isActive = config.method === m;
              return (
                <button
                  key={m}
                  onClick={() => handleMethodChange(m)}
                  disabled={!canEdit}
                  id={`forecast-method-${m}`}
                  type="button"
                  className={`text-xs py-2 rounded-xl border text-center font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20"
                      : "bg-black/30 border-white/10 text-slate-300 hover:bg-white/5"
                  } ${!canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {m === "SMA" ? "SMA" : m === "EMA" ? "EMA" : "Linear Trend"}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed font-sans">
            {config.method === "SMA" && "Simple Moving Average: Smooths out random spikes. Ideal for steady demand products."}
            {config.method === "EMA" && "Exponential Moving Average: Heavily weights recent months. Highly responsive to new trends."}
            {config.method === "LINEAR" && "Linear Regression Trendline: Models continuous upward or downward growth momentum."}
          </p>
        </div>

        {/* Sliders: Parameters */}
        <div className="space-y-4">
          
          {/* Horizon Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Forecast Horizon</span>
              <span className="font-mono text-blue-400 font-semibold">{config.horizon} Months</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={config.horizon}
              onChange={(e) => handleSliderChange("horizon", parseInt(e.target.value))}
              disabled={!canEdit}
              id="horizon-range-input"
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Conditional parameters */}
          {config.method === "SMA" && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Moving Average Period</span>
                <span className="font-mono text-blue-400 font-semibold">{config.smaPeriod} Months</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={config.smaPeriod}
                onChange={(e) => handleSliderChange("smaPeriod", parseInt(e.target.value))}
                disabled={!canEdit}
                id="sma-period-range-input"
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}

          {config.method === "EMA" && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Smoothing Factor (alpha)</span>
                <span className="font-mono text-blue-400 font-semibold">{config.alpha.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={config.alpha}
                onChange={(e) => handleSliderChange("alpha", parseFloat(e.target.value))}
                disabled={!canEdit}
                id="alpha-range-input"
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}
        </div>

        {/* Global Financial Assumed Norms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1 px-1">
              Setup/Order Cost
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-mono text-slate-500">
                $
              </span>
              <input
                type="number"
                min="1"
                max="1000"
                value={config.setupCostDefault}
                onChange={(e) => handleSliderChange("setupCostDefault", Math.max(1, parseInt(e.target.value) || 0))}
                disabled={!canEdit}
                id="setup-cost-input"
                className="block w-full rounded-xl bg-black/30 border border-white/10 pl-6 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 leading-normal block mt-1 font-mono">Setup weight (S)</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1 px-1">
              Interest Margin %
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                value={config.carryingCostRateDefault}
                onChange={(e) => handleSliderChange("carryingCostRateDefault", Math.max(1, parseInt(e.target.value) || 0))}
                disabled={!canEdit}
                id="holding-rate-input"
                className="block w-full rounded-xl bg-black/30 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs font-mono text-slate-500">
                %
              </span>
            </div>
            <span className="text-[10px] text-slate-500 leading-normal block mt-1 font-mono">Carrying cost rate (H)</span>
          </div>
        </div>

      </div>

      {!canEdit && (
        <div className="mt-3 text-[11px] text-amber-500 font-mono">
          ▲ Active role restrictions apply. Request access from Sara Chen.
        </div>
      )}
    </div>
  );
}
