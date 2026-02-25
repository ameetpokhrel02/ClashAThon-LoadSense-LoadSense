import express from "express";
import {
  calculateWorkload,
  getWorkload,
  getAlert,
  getWorkloadSummary,
} from "../controllers/workloadController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All workload routes are protected — user must be logged in
router.post("/calculate", protect, calculateWorkload);   // trigger recalculation
router.get("/", protect, getWorkload);                   // all weekly data
router.get("/alert", protect, getAlert);                 // only high/critical alerts
router.get("/summary", protect, getWorkloadSummary);     // dashboard summary

export default router;