import express from "express";
import { createRecommendation, getRecommendation,deleteMultipleRecommendation } from "../controller/recommendController.js";
import validateBody from "../middlewares/validateBody.js";
import { bookJoiSchema } from "../validators/bookValidation.js";

const router = express.Router();

router.post("/recommend", validateBody(bookJoiSchema),createRecommendation);
router.get("/recommend", getRecommendation);
router.delete("/recommend",deleteMultipleRecommendation);

export default router;
