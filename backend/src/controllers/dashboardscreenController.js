import {
  calculateWorkloadForUser,
  getDashboardAlerts,
  getDashboardSummary,
  syncUpcomingWorkloadsForUser,
} from "../models/dashboardscreenmodel.js";

export const calculateDashboard = async (req, res) => {
  try {
    const user_id = req.user.id;
    const results = await syncUpcomingWorkloadsForUser(user_id);
    if (!results.length) {
      return res.json({ message: "No upcoming deadlines found", weeks: [] });
    }
    return res.json({ message: "Dashboard workload calculated", weeks: results });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getDashboardAlert = async (req, res) => {
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

export const getDashboardSummaryView = async (req, res) => {
  try {
    const user_id = req.user.id;
    const summary = await getDashboardSummary(user_id);
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
