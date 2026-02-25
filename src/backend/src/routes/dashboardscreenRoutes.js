import express from "express";
import protect from "../middleware/auth.js";
import {
  calculateDashboard,
  getDashboardAlert,
  getDashboardSummaryView,
} from "../controllers/dashboardscreenController.js";

const router = express.Router();

router.post("/calculate", protect, calculateDashboard);
router.get("/alert", protect, getDashboardAlert);
router.get("/summary", protect, getDashboardSummaryView);

export default router;
