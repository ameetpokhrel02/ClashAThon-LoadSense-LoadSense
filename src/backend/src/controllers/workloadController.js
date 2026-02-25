// Calendar workload stats endpoint
export const getCalendarWorkloadStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    let { month, year } = req.query;

    if (month === undefined || year === undefined) {
      const now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
    } else {
      month = parseInt(month, 10);
      year = parseInt(year, 10);
    }

    // 1. Calculate Monthly Summary
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const monthlyDeadlines = await Deadline.find({
      user_id,
      dueDate: { $gte: startOfMonth, $lte: endOfMonth }
    }).lean();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyHoursMap = {};
    for (const dl of monthlyDeadlines) {
      const dateKey = new Date(dl.dueDate).getDate();
      dailyHoursMap[dateKey] = (dailyHoursMap[dateKey] || 0) + (dl.estimatedHours || 0);
    }

    let peakDays = 0;
    let safeDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const hours = dailyHoursMap[day] || 0;
      if (hours > 6) peakDays++;
      else if (hours === 0) safeDays++;
    }

    const completedCount = monthlyDeadlines.filter(dl => dl.is_completed).length;
    let planAdherence = 100;
    const pastDeadlines = monthlyDeadlines.filter(dl => new Date(dl.dueDate) < new Date());
    if (pastDeadlines.length > 0) {
      const pastCompleted = pastDeadlines.filter(dl => dl.is_completed).length;
      planAdherence = Math.round((pastCompleted / pastDeadlines.length) * 100);
    } else if (monthlyDeadlines.length > 0) {
      planAdherence = Math.round((completedCount / monthlyDeadlines.length) * 100);
    }

    const monthlySummary = {
      totalDeadlines: monthlyDeadlines.length,
      peakDays,
      safeDays,
      planAdherence
    };

    // 2. Calculate Weekly Load Trend (Current Week)
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);

    const weeklyDeadlines = await Deadline.find({
      user_id,
      dueDate: { $gte: monday, $lte: friday }
    });

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const weeklyDailyHours = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };

    for (const dl of weeklyDeadlines) {
      const dayIndex = new Date(dl.dueDate).getDay(); // 1 = Mon .. 5 = Fri
      if (dayIndex >= 1 && dayIndex <= 5) {
        weeklyDailyHours[weekDays[dayIndex - 1]] += (dl.estimatedHours || 0);
      }
    }

    const weeklyLoadTrend = weekDays.map(day => {
      const hours = weeklyDailyHours[day];
      // Max capacity is treated as 8 hours a day
      const capacity = Math.min(100, Math.round((hours / 8) * 100));
      let status = 'safe';
      if (capacity > 75) status = 'overload';
      else if (capacity > 40) status = 'moderate';
      return { day, capacity, status };
    });

    // 3. AI Tip
    let aiTip = null;
    const upcomingDeadlines = await Deadline.find({
      user_id,
      is_completed: false,
      dueDate: { $gte: new Date() }
    }).sort({ weight: -1, dueDate: 1 }).limit(1).lean();

    if (upcomingDeadlines.length > 0) {
      const topTask = upcomingDeadlines[0];
      const due = new Date(topTask.dueDate);
      const start = new Date(due);
      start.setDate(start.getDate() - 3); // recommend starting 3 days before
      aiTip = {
        message: `Plan ahead for your upcoming high-impact task: ${topTask.title}.`,
        taskId: topTask._id.toString(),
        taskTitle: topTask.title,
        dueDate: due.toISOString(),
        recommendedStartDate: start.toISOString()
      };
    } else {
      aiTip = {
        message: "Your schedule is clear! Take some time to rest or review past materials.",
        taskId: "0",
        taskTitle: "Rest",
        dueDate: new Date().toISOString(),
        recommendedStartDate: new Date().toISOString()
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        weeklyLoadTrend,
        monthlySummary,
        aiTip
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
import Workload from "../models/Workload.js";
import Deadline from "../models/Deadline.js";

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