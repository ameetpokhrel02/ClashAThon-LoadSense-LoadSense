import express from "express";
import {
  addDeadline,
  getDeadlines,
  deleteDeadline,
} from "../controllers/deadlineController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All deadline routes require a valid JWT
router.post("/", protect, addDeadline);
router.get("/", protect, getDeadlines);
router.delete("/:id", protect, deleteDeadline);

export default router;