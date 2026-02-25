import express from "express";
import { getReminders } from "../controllers/reminderController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Get upcoming reminders
router.get("/", protect, getReminders);

export default router;
