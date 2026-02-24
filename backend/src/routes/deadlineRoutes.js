import express from "express";
import {
  addDeadline,
  getDeadlines,
  deleteDeadline,
} from "../controllers/deadlineController.js";

const router = express.Router();

router.post("/", addDeadline);
router.get("/", getDeadlines);
router.delete("/:id", deleteDeadline);

export default router;