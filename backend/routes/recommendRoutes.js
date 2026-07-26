import express from "express";
import {
  createRecommendation,
  deleteMultipleRecommendation,
  getAllRecommendations,
  getDepartmentRecommendations,
  getMyRecommendations,
} from "../controllers/recommendController.js";
import validateBody from "../middlewares/validateBody.js";
import { bookJoiSchema } from "../validators/bookValidation.js";
import { requireRole, authenticate, blockStudents } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/recommend",
  authenticate,
  blockStudents,
  validateBody(bookJoiSchema),
  createRecommendation
);

router.get("/recommend", authenticate, blockStudents, getMyRecommendations);

router.get(
  "/recommend/department",
  authenticate,
  requireRole("hod"),
  getDepartmentRecommendations
);

router.get(
  "/recommend/all",
  authenticate,
  requireRole("hod"),
  getAllRecommendations
);

router.delete("/recommend", deleteMultipleRecommendation);

export default router;