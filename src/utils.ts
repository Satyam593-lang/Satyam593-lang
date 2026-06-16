import { SKUItem, ForecastConfig, StockStatus, SalesVelocity } from "./types";

// Standard normal service level Z index for safety stock (e.g., 95% service level is 1.65)
const Z_SCORE = 1.65;

// Sample original CSV data text to let the user download a template
export const CSV_TEMPLATE = `SKU,Name,Category,CurrentStock,Price,LeadTime,SetupCost,HoldingCostRate,M1_Qty,M2_Qty,M3_Qty,M4_Qty,M5_Qty,M6_Qty,M7_Qty,M8_Qty,M9_Qty,M10_Qty,M11_Qty,M12_Qty
SKU-101,Pro Headphones,Electronics,450,119.99,7,45,0.18,120,115,130,140,155,165,150,145,170,185,190,210
SKU-102,Cotton T-Shirt,Apparel,2400,19.99,14,30,0.15,480,510,550,620,700,750,810,790,680,590,520,460
SKU-103,Bento Food Container,Home & Kitchen,80,14.95,10,25,0.22,310,320,290,305,340,360,315,300,312,325,350,380
SKU-104,Organic Protein Shake,Groceries,35,29.99,5,15,0.25,220,240,230,250,260,280,270,290,310,300,320,350
SKU-105,Ergonomic Office Chair,Office,45,249.99,21,120,0.16,35,42,39,45,52,58,47,40,55,62,68,75
SKU-106,Smart Watch Active,Electronics,12,189.99,8,50,0.20,95,110,105,115,120,130,125,110,135,145,150,175
SKU-107,Suede Winter Jacket,Apparel,850,120.00,18,80,0.15,42,35,28,15,10,8,12,25,48,82,150,210
SKU-108,Precision Screwdriver Set,Industrial,580,24.50,12,35,0.18,85,90,88,92,95,91,89,93,98,96,102,110
`;

// Helper to determine Month Labels going backward from current time
export function generateMonthLabels(count: number = 12): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date();
  const result: string[] = [];
  
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    result.push(`${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`);
  }
  return result;
}

// Generate future Labels based on forecast horizon
export function generateFutureLabels(horizon: number = 3): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date();
  const result: string[] = [];
  
  for (let i = 1; i <= horizon; i++) {
    const d = new Date(date.getFullYear(), date.getMonth() + i, 1);
    result.push(`${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)} (F)`);
  }
  return result;
}

export const INITIAL_SKUS: SKUItem[] = [
  {
    id: "1",
    sku: "SKU-101",
    name: "Pro Headphones",
    category: "Electronics",
    price: 119.99,
    currentStock: 450,
    leadTime: 7,
    setupCost: 45,
    holdingCostRate: 0.18,
    history: [120, 115, 130, 140, 155, 165, 150, 145, 170, 185, 190, 210],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "2",
    sku: "SKU-102",
    name: "Cotton T-Shirt",
    category: "Apparel",
    price: 19.99,
    currentStock: 2400,
    leadTime: 14,
    setupCost: 30,
    holdingCostRate: 0.15,
    history: [480, 510, 550, 620, 700, 750, 810, 790, 680, 590, 520, 460],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "3",
    sku: "SKU-103",
    name: "Bento Food Container",
    category: "Home & Kitchen",
    price: 14.95,
    currentStock: 80,
    leadTime: 10,
    setupCost: 25,
    holdingCostRate: 0.22,
    history: [310, 320, 290, 305, 340, 360, 315, 300, 312, 325, 350, 380],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "4",
    sku: "SKU-104",
    name: "Organic Protein Shake",
    category: "Groceries",
    price: 29.99,
    currentStock: 35,
    leadTime: 5,
    setupCost: 15,
    holdingCostRate: 0.25,
    history: [220, 240, 230, 250, 260, 280, 270, 290, 310, 300, 320, 350],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "5",
    sku: "SKU-105",
    name: "Ergonomic Office Chair",
    category: "Office",
    price: 249.99,
    currentStock: 45,
    leadTime: 21,
    setupCost: 120,
    holdingCostRate: 0.16,
    history: [35, 42, 39, 45, 52, 58, 47, 40, 55, 62, 68, 75],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "6",
    sku: "SKU-106",
    name: "Smart Watch Active",
    category: "Electronics",
    price: 189.99,
    currentStock: 12,
    leadTime: 8,
    setupCost: 50,
    holdingCostRate: 0.20,
    history: [95, 110, 105, 115, 120, 130, 125, 110, 135, 145, 150, 175],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "7",
    sku: "SKU-107",
    name: "Suede Winter Jacket",
    category: "Apparel",
    price: 120.00,
    currentStock: 850,
    leadTime: 18,
    setupCost: 80,
    holdingCostRate: 0.15,
    history: [42, 35, 28, 15, 10, 8, 12, 25, 48, 82, 150, 210],
    historyLabels: generateMonthLabels(12),
  },
  {
    id: "8",
    sku: "SKU-108",
    name: "Precision Screwdriver Set",
    category: "Industrial",
    price: 24.50,
    currentStock: 580,
    leadTime: 12,
    setupCost: 35,
    holdingCostRate: 0.18,
    history: [85, 90, 88, 92, 95, 91, 89, 93, 98, 96, 102, 110],
    historyLabels: generateMonthLabels(12),
  }
];

// Time-Series Math Utilities
export function calculateSMA(history: number[], horizon: number, period: number): number[] {
  const result: number[] = [];
  const numbers = [...history];
  
  for (let h = 0; h < horizon; h++) {
    // take the last 'period' elements
    const slice = numbers.slice(-period);
    const avg = slice.reduce((a, b) => a + b, 0) / (slice.length || 1);
    result.push(Math.round(avg));
    // feed the forecast back into history for progressive predictions
    numbers.push(avg);
  }
  return result;
}

export function calculateEMA(history: number[], horizon: number, alpha: number): number[] {
  const result: number[] = [];
  const numbers = [...history];
  
  for (let h = 0; h < horizon; h++) {
    // EMA recursion: EMA = alpha * lastActual + (1 - alpha) * lastEMA
    let currentEMA = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      currentEMA = alpha * numbers[i] + (1 - alpha) * currentEMA;
    }
    result.push(Math.round(currentEMA));
    numbers.push(currentEMA);
  }
  return result;
}

export function calculateLinearRegression(history: number[], horizon: number): number[] {
  const n = history.length;
  if (n === 0) return Array(horizon).fill(0);
  
  // calculate sum of x, y, xx, xy
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += history[i];
    sumXX += i * i;
    sumXY += i * history[i];
  }
  
  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const c = (sumY - m * sumX) / n;
  
  const result: number[] = [];
  for (let h = 0; h < horizon; h++) {
    const nextVal = m * (n + h) + c;
    result.push(Math.round(Math.max(0, nextVal)));
  }
  return result;
}

// Calculate statistical deviation of history
function calculateStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

// Full Forecasting & Inventory Optimization Pipeline
export function computeItemMetrics(item: SKUItem, config: ForecastConfig): SKUItem {
  const history = item.history;
  const horizon = config.horizon;
  
  // 1. Forecast Generation
  let forecast: number[] = [];
  if (config.method === "SMA") {
    forecast = calculateSMA(history, horizon, config.smaPeriod);
  } else if (config.method === "EMA") {
    forecast = calculateEMA(history, horizon, config.alpha);
  } else {
    // Default to linear trend forecast
    forecast = calculateLinearRegression(history, horizon);
  }
  
  // 2. Base Averages
  const avgMonthlyDemand = history.reduce((a, b) => a + b, 0) / (history.length || 1);
  const stdDevDemand = calculateStdDev(history, avgMonthlyDemand);
  
  // Convert standard deviation to daily (standard rule)
  const dailyDemandAvg = avgMonthlyDemand / 30;
  const leadTimeDays = item.leadTime || config.leadTimeDefault;
  
  // 3. Safety Stock
  // SS = Z * stdDevMonthly * sqrt(L/30)
  const safetyStock = Math.round(Z_SCORE * stdDevDemand * Math.sqrt(leadTimeDays / 30)) || Math.round(avgMonthlyDemand * 0.15);
  
  // 4. Reorder Point (ROP)
  // ROP = (daily_demand * lead_time) + safety_stock
  const reorderPoint = Math.round((dailyDemandAvg * leadTimeDays) + safetyStock);
  
  // 5. Economic Order Quantity (EOQ)
  // Annual demand = Monthly Demand * 12
  const D_annual = avgMonthlyDemand * 12;
  const setupCost = item.setupCost || config.setupCostDefault;
  const holdingRate = item.holdingCostRate || config.carryingCostRateDefault / 100;
  const unitHoldingCost = (holdingRate * item.price) || 1.0;
  const eoq = Math.round(Math.sqrt((2 * D_annual * setupCost) / unitHoldingCost)) || 50;

  // 6. Predict Stock Status
  // Stockout Risk: current stock is below ROP, or currentStock - (Forecast * leadTime/30) < Safety Stock
  let status: StockStatus = "Normal";
  if (item.currentStock <= reorderPoint) {
    status = "Stockout Risk";
  } else if (item.currentStock > (avgMonthlyDemand * 3.0)) {
    // If we have over 3 months of mean inventory
    status = "Overstock";
  }
  
  // 7. Sales Velocity
  let salesVelocity: SalesVelocity = "Medium";
  if (avgMonthlyDemand > 300) {
    salesVelocity = "High";
  } else if (avgMonthlyDemand < 50) {
    salesVelocity = "Low";
  }

  return {
    ...item,
    forecast,
    forecastLabels: generateFutureLabels(horizon),
    safetyStock,
    reorderPoint,
    eoq,
    status,
    salesVelocity,
  };
}

// Map the dataset pipeline sequentially
export function computeAllMetrics(items: SKUItem[], config: ForecastConfig): SKUItem[] {
  return items.map((item) => computeItemMetrics(item, config));
}

// Safe parsing of user CSV uploads
export function parseCSVData(csvText: string): SKUItem[] {
  const lines = csvText.trim().split("\n");
  if (lines.length <= 1) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const parsedSkus: SKUItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Quick parse CSV splits, keeping string quotes elements grouped if standard csv formatting
    const columns = splitCSVRow(lines[i]);
    const itemObj: any = {
      id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      history: [],
      historyLabels: generateMonthLabels(12),
    };

    // Gather history indicators dynamically
    const historyTemp: { [key: string]: number } = {};

    headers.forEach((header, index) => {
      const val = columns[index]?.trim();
      if (val === undefined) return;

      if (header === "sku" || header === "partno" || header === "code") {
        itemObj.sku = val;
      } else if (header === "name" || header === "title" || header === "description") {
        itemObj.name = val;
      } else if (header === "category" || header === "dept" || header === "group") {
        itemObj.category = val;
      } else if (header === "currentstock" || header === "qty" || header === "onhand" || header === "stock") {
        itemObj.currentStock = parseInt(val, 10) || 0;
      } else if (header === "price" || header === "cost" || header === "unitprice") {
        itemObj.price = parseFloat(val) || 10.00;
      } else if (header === "leadtime" || header === "duration" || header === "days") {
        itemObj.leadTime = parseInt(val, 10) || 12;
      } else if (header === "setupcost" || header === "orderingcost") {
        itemObj.setupCost = parseFloat(val) || 40.00;
      } else if (header === "holdingcostrate" || header === "holdingrate" || header === "carryingcost") {
        itemObj.holdingCostRate = parseFloat(val) || 0.20;
      } else if (header.match(/m\d+/)) {
        // e.g. M1_Qty, M2_Qty
        const match = header.match(/m(\d+)/);
        if (match) {
          const mIndex = parseInt(match[1], 10);
          historyTemp[mIndex] = parseInt(val, 10) || 0;
        }
      }
    });

    if (!itemObj.sku) {
      itemObj.sku = `SKU-${1000 + i}`;
    }
    if (!itemObj.name) {
      itemObj.name = `Imported Item ${i}`;
    }
    if (!itemObj.category) {
      itemObj.category = "General";
    }
    if (itemObj.currentStock === undefined) {
      itemObj.currentStock = 100;
    }
    if (itemObj.price === undefined) {
      itemObj.price = 25.00;
    }
    if (itemObj.leadTime === undefined) {
      itemObj.leadTime = 10;
    }
    if (itemObj.setupCost === undefined) {
      itemObj.setupCost = 30;
    }
    if (itemObj.holdingCostRate === undefined) {
      itemObj.holdingCostRate = 0.20;
    }

    // Convert keys of historyTemp into sequential history list
    const sortedMonthKeys = Object.keys(historyTemp).map(Number).sort((a, b) => a - b);
    if (sortedMonthKeys.length > 0) {
      itemObj.history = sortedMonthKeys.map((k) => historyTemp[k]);
      itemObj.historyLabels = generateMonthLabels(itemObj.history.length);
    } else {
      // Create random reasonable sales behavior if historical quantities are absent
      itemObj.history = [150, 160, 140, 155, 170, 190, 180, 165, 175, 195, 201, 220].map(
        (val) => Math.round(val * (0.8 + Math.random() * 0.4))
      );
      itemObj.historyLabels = generateMonthLabels(12);
    }

    parsedSkus.push(itemObj as SKUItem);
  }

  return parsedSkus;
}

// CSV Row parser grouping quoted columns safely
function splitCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Convert dataset to standard exportable CSV text
export function convertToCSV(items: SKUItem[]): string {
  if (items.length === 0) return "";
  
  const headers = [
    "SKU", "Product Name", "Category", "Current Stock", "Unit Price", "Lead Time (Days)",
    "Setup Cost", "Carrying Cost Rate", "Safety Stock Recommendation", "Reorder Point", "Economic Order Quantity (EOQ)", "Inventory Status"
  ];

  // Append history monthly columns
  const histLen = items[0].history.length;
  for (let i = 1; i <= histLen; i++) {
    headers.push(`Month ${i} Sales`);
  }

  // Append forecasts
  const foreLen = items[0].forecast?.length || 0;
  for (let i = 1; i <= foreLen; i++) {
    headers.push(`Forecast Month ${i}`);
  }

  let lines = [headers.join(",")];

  items.forEach((item) => {
    const row = [
      `"${item.sku}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.currentStock,
      item.price.toFixed(2),
      item.leadTime,
      item.setupCost,
      item.holdingCostRate,
      item.safetyStock || "N/A",
      item.reorderPoint || "N/A",
      item.eoq || "N/A",
      `"${item.status || "Normal"}"`
    ];

    // Historical values
    item.history.forEach((qty) => row.push(qty));

    // Forecast values
    if (item.forecast) {
      item.forecast.forEach((qty) => row.push(qty));
    }

    lines.push(row.join(","));
  });

  return lines.join("\n");
}
