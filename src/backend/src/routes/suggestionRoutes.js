import express from "express";
import { generateAISuggestion } from "../controllers/suggestionController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// AI study plan suggestion endpoint
router.post("/ai/suggestion", protect, generateAISuggestion);

export default router;
