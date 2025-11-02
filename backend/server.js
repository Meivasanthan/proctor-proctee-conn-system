import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

import connectDB from "./db.js";
import AuthRouter from "./routes/AuthRouter.js";
import studentRoutes from "./routes/studentRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
import StaffRoutes from "./routes/StaffRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// Security setup
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Allow frontend connections
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder if missing
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 'uploads' folder created");
}

// Serve uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(uploadDir, {
    setHeaders: (res) => {
      res.set("X-Content-Type-Options", "nosniff");
    },
  })
);

// ✅ Routes without '/api' prefix
// (So frontend calls like http://localhost:5000/login will work)
app.use(AuthRouter);
app.use(studentRoutes);
// app.use(uploadRoutes);
app.use(StaffRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running successfully" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
