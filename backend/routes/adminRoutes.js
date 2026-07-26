import express from "express";
import { getAllProcessedRecommendations } from "../controllers/adminController.js";
import { requireRole, authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Admin routes are working!" });
});

router.get(
  "/processed",
  authenticate,
  requireRole("admin", "hod"),
  getAllProcessedRecommendations
);

export default router;