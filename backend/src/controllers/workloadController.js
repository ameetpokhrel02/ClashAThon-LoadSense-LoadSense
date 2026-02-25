import Workload from "../models/Workload.js";

import {
  calculateWorkloadForUser,
  getDashboardAlerts,
  getDashboardSummary,
  syncUpcomingWorkloadsForUser,
} from "../models/dashboardscreenmodel.js";

// Groups all upcoming deadlines by week, sums their weights, and saves a Workload record per week.
export const calculateWorkload = async (req, res) => {
  try {
    const user_id = req.user.id;

    const results = await syncUpcomingWorkloadsForUser(user_id);
    if (!results.length) {
      return res.json({ message: "No upcoming deadlines found", weeks: [] });
    }

    return res.json({ message: "Workload calculated", weeks: results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all weekly workload data (used for charts/trends)
export const getWorkload = async (req, res) => {
  try {
    const user_id = req.user.id;

    let weeks = await Workload.find({ user_id })
      .sort({ week_start: 1 })
      .populate("deadlines", "title type dueDate weight impact_level course");

    if (!weeks.length) {
      await calculateWorkloadForUser(user_id);
      weeks = await Workload.find({ user_id })
        .sort({ week_start: 1 })
        .populate("deadlines", "title type dueDate weight impact_level course");
    }

    return res.json({ weeks });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Only high/critical alerts (kept for backwards compatibility; dashboard routes also expose this)
export const getAlert = async (req, res) => {
  try {
    const user_id = req.user.id;
    const alerts = await getDashboardAlerts(user_id);

    if (!alerts.length) {
      return res.json({
        message: "No overload detected. Your schedule looks manageable!",
        alerts: [],
      });
    }

    return res.json({ alerts });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Returns a dashboard summary showing the current week, the busiest upcoming week, and the next 8 weeks.
export const getWorkloadSummary = async (req, res) => {
  try {
    const user_id = req.user.id;

    const summary = await getDashboardSummary(user_id, { limit: 8 });
    return res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};