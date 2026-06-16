export type StockStatus = "Normal" | "Stockout Risk" | "Overstock";
export type SalesVelocity = "Low" | "Medium" | "High";

export interface SKUItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currentStock: number;
  leadTime: number; // in days
  setupCost: number; // ordering cost
  holdingCostRate: number; // annual holding cost rate (e.g., 0.20 for 20%)
  
  // Recent 12 months of sales
  history: number[];
  historyLabels: string[];
  
  // Forecast parameters generated dynamically from user setup
  forecast?: number[];
  forecastLabels?: string[];
  
  // Recommendations and indicators
  safetyStock?: number;
  reorderPoint?: number;
  eoq?: number; // Economic Order Quantity
  status?: StockStatus;
  salesVelocity?: SalesVelocity;
}

export type ForecastMethod = "SMA" | "EMA" | "WMA" | "LINEAR";

export interface ForecastConfig {
  method: ForecastMethod;
  horizon: number; // months to forecast (e.g., 3, 6)
  smaPeriod: number; // period for simple moving average
  alpha: number; // smoothing factor for exponential moving average
  leadTimeDefault: number; // days
  carryingCostRateDefault: number; // %
  setupCostDefault: number; // $
}

export type UserRole = "Director" | "Planner" | "Logistics" | "Guest";

export interface UserSession {
  username: string;
  role: UserRole;
  fullName: string;
  department: string;
  permissions: string[];
}
