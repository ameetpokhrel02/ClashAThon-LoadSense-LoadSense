import express from "express";
import protect from "../middleware/auth.js";
import {
  createFeedbackRating,
  getFeedbackRatings,
} from "../controllers/adminFeedbackRatingController.js";

const router = express.Router();

router.post("/", protect, createFeedbackRating);
router.get("/", protect, getFeedbackRatings);

export default router;
