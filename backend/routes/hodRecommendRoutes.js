import express from "express";
import {
  updateStatus,
  getPendingRecommendation,
  getProcessedRecommendations,
} from "../controllers/hodApprovalController.js";
import { requireRole, authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.put("/update-status", authenticate, requireRole("hod"), updateStatus);

router.get("/pending", authenticate, requireRole("hod"), getPendingRecommendation);

router.get("/processed", authenticate, requireRole("hod"), getProcessedRecommendations);

export default router;