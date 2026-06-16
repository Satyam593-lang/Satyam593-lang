import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client safely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Supply Chain Insights endpoint
app.post("/api/forecast-insights", async (req, res) => {
  try {
    const { items, datasetSummary, analysisRequest } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing items array" });
    }

    const aiPrompt = `
You are an expert Supply Chain Director and Inventory Optimization Consultant. Analyze the following inventory data and forecasting metrics, then provide concrete, high-value, actionable insights.

dataset Summary:
- Number of items evaluated: ${datasetSummary?.totalItems || items.length}
- Primary Category / Context: ${datasetSummary?.category || "General SKU list"}
- Global metrics: Total stock: ${datasetSummary?.totalStock || "N/A"}, Stocked-out items: ${datasetSummary?.stockouts || "N/A"}, Overstocked items: ${datasetSummary?.overstocks || "N/A"}

Selected Item for Deep Dive:
${analysisRequest?.singleItem ? JSON.stringify(analysisRequest.singleItem, null, 2) : "Global Portfolio Analysis"}

All SKU Summary:
${JSON.stringify(
  items.map((item) => ({
    sku: item.sku,
    name: item.name,
    category: item.category,
    currentStock: item.currentStock,
    unitPrice: item.price,
    monthlySalesAvg: item.history ? (item.history.reduce((a: number, b: number) => a + b, 0) / item.history.length).toFixed(1) : "N/A",
    demandForecast: item.forecast ? item.forecast[0] : "N/A",
    stockStatus: item.status, // overstock, normal, stockout_risk
    recommendedReorder: item.recommendedReorder,
    recommendedSafetyStock: item.safetyStock,
    economicOrderQuantity: item.eoq,
  })),
  null,
  2
)}

Please structure your response with the following sections using clean Markdown:
1. **Supply Chain Executive Summary**: High-level health of the current sales force and inventory mix.
2. **Critical Overstock & Stockout Risks**: Name specific items that are highly vulnerable. Explain why.
3. **Inventory Capital Reallocation recommendations**: How can checking carrying costs vs order setup costs save capital (EOQ recommendations)?
4. **Actionable Demand Remediation Steps**: Concrete actions (e.g., markdown promotions for overstocks, rush orders for stockout risks, safety stock buffers).
5. **AI Strategy Playbook**: A creative, highly tailored operational tactic based on the historical pattern (seasonality, spikes in demand, or plateau).

Make the tone professional, authoritative, and data-driven. Do not references internal files or JSON terms; write as an executive summary for a business presenter.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: aiPrompt,
      config: {
        systemInstruction: "You are an authority in smart retail logistics, warehouse operations, demand sensing, and predictive inventory models.",
      },
    });

    const text = response.text || "Could not generate insights.";
    res.json({ insights: text });
  } catch (error: any) {
    console.error("Gemini Insights generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate forecasting insights from Gemini" });
  }
});

// AI Supply Chain Chatbot Assistant endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, items, activeScenario } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    // Capture context of items in simplified digest to fit tokens
    const itemsDigest = items && Array.isArray(items) 
      ? items.slice(0, 15).map(item => ({
          sku: item.sku,
          name: item.name,
          category: item.category,
          stock: item.currentStock,
          price: item.price,
          status: item.status,
          safety: item.safetyStock,
          eoq: item.eoq,
          rop: item.reorderPoint
        }))
      : [];

    const systemInstruction = `
You are a state-of-the-art AI Supply Chain Assistant built into the Enterprise Control Tower dashboard. 
You correspond with highly seasoned logistics managers, directors, and inventory planners.

Context:
- Current Inventory Items (Subset): ${JSON.stringify(itemsDigest, null, 2)}
- Active Control Tower Scenario: ${activeScenario || "None / Baseline Operational Mode"}

Guidelines:
1. Provide extremely precise, numerically grounded, and professional business answers.
2. Highlight immediate remediation pathways (e.g., suggesting specific reorder items, holding cost savings, or supply routes).
3. Be concise and structured. Use short bullet points and dynamic highlights. Do not sound generic; talk about specific SKUs and metrics present in the dashboard when applicable.
4. Keep Markdown elegant and brief. Avoid long introductions or corporate filler text.
`;

    const chatContent = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContent,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    const reply = response.text || "I am analyzing the logistics buffers. Please repeat your query.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chatbot error:", error);
    res.status(500).json({ error: error.message || "Failed to query Gemini assistant" });
  }
});

// Configure Vite and Asset Fallback
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Supply Chain forecasting platform listening on port ${PORT}`);
  });
}

setupVite();
