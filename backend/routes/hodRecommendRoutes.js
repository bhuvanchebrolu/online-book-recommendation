import express from "express";
import { updateStatus ,getPendingRecommendation, getProcessedRecommendations} from "../controller/hodApprovalController.js";
import { requireRole } from "../middlewares/auth.js";

const router=express.Router();

router.put("/update-status",requireRole("professor"),updateStatus);
router.get("/pending",getPendingRecommendation);
router.get("/processed",getProcessedRecommendations);
export default router;