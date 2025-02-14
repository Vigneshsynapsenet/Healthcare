// import express from 'express';
// import cors from 'cors';
// import axios from 'axios';

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // Simulate performance metrics since we can't run Lighthouse in WebContainer
// function simulatePerformanceMetrics(responseTime, hasViewport, hasHttps) {
//   const performance = Math.min(100, Math.max(0, 100 - responseTime / 100));
//   const accessibility = hasViewport ? 85 : 60;
//   const bestPractices = hasHttps ? 90 : 70;
//   const seo = hasViewport ? 88 : 65;

//   return {
//     performance,
//     accessibility,
//     bestPractices,
//     seo
//   };
// }

// app.post('/analyze', async (req, res) => {
//   try {
//     const { url } = req.body;
//     const startTime = Date.now();
    
//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//       }
//     });

//     const responseTime = Date.now() - startTime;
//     const hasViewport = response.data.includes('viewport');
//     const hasHttps = url.startsWith('https://');

//     const simulatedMetrics = simulatePerformanceMetrics(responseTime, hasViewport, hasHttps);

//     res.json({ 
//       data: response.data,
//       lighthouse: simulatedMetrics
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Proxy server running at http://localhost:${port}`);
// });
import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve React frontend from 'dist' folder
app.use(express.static(path.join(__dirname, "dist")));

// API Route for website analysis
app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;
    const startTime = Date.now();
    
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const responseTime = Date.now() - startTime;
    const hasViewport = response.data.includes('<meta name="viewport"');
    const hasHttps = url.startsWith("https");

    res.json({
      performance: Math.min(100, Math.max(0, 100 - responseTime / 100)),
      accessibility: hasViewport ? 85 : 60,
      bestPractices: hasHttps ? 90 : 70,
      seo: hasViewport ? 88 : 65
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch website data" });
  }
});

// Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
