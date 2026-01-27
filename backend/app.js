import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectMongo from "./utils/connectMongo.js";

import recommendRoutes from "./routes/recommendRoutes.js";
import hodApprovalRoutes from "./routes/hodRecommendRoutes.js";
import authRoutes from "./routes/auth.js";

// passport strategy
import "./passport/dauth.js";

const app = express();

// ✅ CORS (cookies allowed)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// routes
app.use("/api", recommendRoutes);
app.use("/api/recommend", hodApprovalRoutes);
app.use("/auth", authRoutes);

app.listen(8080, async () => {
  console.log("Server running on port 8080");
  await connectMongo();
});
