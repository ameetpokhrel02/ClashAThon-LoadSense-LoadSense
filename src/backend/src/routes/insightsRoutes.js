import express from "express";
import { getInsights } from "../controllers/insightsController.js";
import protect from "../middleware/auth.js";

const router = express.Router();
    

// GET /api/insights — consolidated weekly trend & risk pattern data
router.get("/", protect, getInsights);

export default router;
