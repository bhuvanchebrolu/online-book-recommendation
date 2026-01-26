import express from "express";
import { updateStatus ,getPendingRecommendation, getProcessedRecommendations} from "../controller/hodApprovalController.js";

const router=express.Router();

router.put("/update-status",updateStatus);
router.get("/pending",getPendingRecommendation);
router.get("/processed",getProcessedRecommendations);
export default router;