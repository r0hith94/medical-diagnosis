import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Prediction API (Since we can't run Python ML easily here, 
  // we'll use a logic-based approach or Gemini in the frontend)
  // However, the user asked for a /predict endpoint.
  app.post("/api/predict", (req, res) => {
    const { symptoms } = req.body;
    // In a real app, this would call the Python ML model.
    // For this demo, we'll return a simulated response.
    // The actual "Smart" part will be handled by Gemini in the frontend.
    res.json({
      prediction: "Simulated Disease",
      confidence: 0.85,
      message: "This is a simulated prediction from the backend."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
