import express from "express";
import { generateStudyPlan } from "../controllers/aiController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/ai/suggestion - Generate AI-powered study plan
router.post("/suggestion", protect, generateStudyPlan);

export default router;
