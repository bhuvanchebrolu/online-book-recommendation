import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import pool          from "./config/db.js";
import authRoutes    from "./routes/auth.js";
import recommendRoutes   from "./routes/recommendRoutes.js";
import hodApprovalRoutes from "./routes/hodRecommendRoutes.js";
import adminRoutes       from "./routes/adminRoutes.js";

const app = express();

// 1. Cookie parser
app.use(cookieParser());

// 2. CORS — must be before routes
app.use(
  cors({
    origin:         "http://localhost:5173",
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. JSON body parser
app.use(express.json());

// 4. Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 5. Routes
app.use("/auth",          authRoutes);
app.use("/api",           recommendRoutes);
app.use("/api/recommend", hodApprovalRoutes);
app.use("/api/admin",     adminRoutes);

// 6. Start
app.listen(5000, async () => {
  console.log("🚀 Server running on port 8080");
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connection verified");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
});