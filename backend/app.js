import dotenv from "dotenv"
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import connectMongo from "./utils/connectMongo.js";
import recommendRoutes from "./routes/recommendRoutes.js";
import hodApprovalRoutes from "./routes/hodRecommendRoutes.js";
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api",recommendRoutes);
app.use("/api/recommend",hodApprovalRoutes);


app.listen(8080,()=>{
    console.log("Server is running on the port 8080");
    console.log(process.env.EMAIL_USER);
    connectMongo();
});