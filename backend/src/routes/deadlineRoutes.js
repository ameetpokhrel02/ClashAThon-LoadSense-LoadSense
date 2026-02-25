// deadlineRoutes.js
import express from "express";
import {
  addDeadline,
  getDeadlines,
  deleteDeadline,
  updateDeadline,
} from "../controllers/deadlineController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All deadline routes require a valid JWT
router.post("/", protect, addDeadline);
router.get("/", protect, getDeadlines);
router.delete("/:id", protect, deleteDeadline);
router.patch("/:id", protect, updateDeadline);

export default router;


