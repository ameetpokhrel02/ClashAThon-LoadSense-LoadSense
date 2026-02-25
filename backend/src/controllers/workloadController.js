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

/**
 * GET /api/workload/calendar-stats
 * Returns calendar-specific workload statistics for a given month
 * Query params: month (0-11), year (YYYY)
 */
export const getCalendarWorkloadStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { month, year } = req.query;
    
    // Default to current month if not specified
    const targetMonth = month !== undefined ? parseInt(month) : new Date().getMonth();
    const targetYear = year !== undefined ? parseInt(year) : new Date().getFullYear();
    
    // Calculate start and end of month
    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    
    // Fetch all deadlines for this month
    const deadlines = await Deadline.find({
      user: user_id,
      dueDate: { $gte: monthStart, $lte: monthEnd }
    }).populate('course_id', 'course_code title');
    
    // Calculate daily load for the week (Mon-Fri)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    
    const weeklyLoadTrend = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    for (let i = 0; i < 5; i++) {
      const dayStart = new Date(monday);
      dayStart.setDate(monday.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Count deadlines and calculate load for this day
      const dayDeadlines = deadlines.filter(d => {
        const dueDate = new Date(d.dueDate);
        return dueDate >= dayStart && dueDate <= dayEnd;
      });
      
      // Calculate capacity percentage (based on hours and weight)
      let capacity = 0;
      dayDeadlines.forEach(d => {
        capacity += (d.estimatedHours || 2) * (d.weight || 1) * 10;
      });
      
      // Also consider deadlines coming up in next 2 days (prep work)
      const upcomingDeadlines = deadlines.filter(d => {
        const dueDate = new Date(d.dueDate);
        const daysUntil = Math.ceil((dueDate - dayStart) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= 2;
      });
      
      upcomingDeadlines.forEach(d => {
        capacity += (d.estimatedHours || 2) * 5; // Add prep work load
      });
      
      capacity = Math.min(capacity, 100); // Cap at 100%
      
      weeklyLoadTrend.push({
        day: dayNames[i],
        capacity: capacity,
        status: capacity > 75 ? 'overload' : capacity > 40 ? 'moderate' : 'safe'
      });
    }
    
    // Calculate monthly summary
    const totalDeadlines = deadlines.length;
    
    // Count peak days (days with high load - multiple or high-weight deadlines)
    const dailyLoadMap = {};
    deadlines.forEach(d => {
      const dateKey = new Date(d.dueDate).toDateString();
      if (!dailyLoadMap[dateKey]) {
        dailyLoadMap[dateKey] = { count: 0, totalWeight: 0 };
      }
      dailyLoadMap[dateKey].count++;
      dailyLoadMap[dateKey].totalWeight += d.weight || 1;
    });
    
    let peakDays = 0;
    let safeDays = 0;
    const daysInMonth = monthEnd.getDate();
    
    Object.values(dailyLoadMap).forEach(day => {
      if (day.count >= 2 || day.totalWeight >= 3) {
        peakDays++;
      }
    });
    
    // Safe days = days with no or low-weight deadlines
    safeDays = daysInMonth - Object.keys(dailyLoadMap).length;
    
    // Calculate plan adherence (mock - could be based on completed vs total)
    const planAdherence = totalDeadlines > 0 ? Math.floor(75 + Math.random() * 20) : 100;
    
    // Find upcoming high-impact tasks for AI tip
    const upcomingHighImpact = deadlines
      .filter(d => {
        const daysUntil = Math.ceil((new Date(d.dueDate) - today) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= 14 && (d.weight >= 3 || d.impact_level === 'High');
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Generate AI tip
    let aiTip = null;
    if (upcomingHighImpact.length > 0) {
      const task = upcomingHighImpact[0];
      const dueDate = new Date(task.dueDate);
      const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const prepStartDate = new Date(today);
      prepStartDate.setDate(today.getDate() + Math.max(1, daysUntil - 7));
      
      aiTip = {
        message: `You have ${upcomingHighImpact.length} high-impact task${upcomingHighImpact.length > 1 ? 's' : ''} due on the ${dueDate.getDate()}${getOrdinalSuffix(dueDate.getDate())}. We recommend starting your ${task.title.toLowerCase()} prep by the ${prepStartDate.getDate()}${getOrdinalSuffix(prepStartDate.getDate())}.`,
        taskId: task._id,
        taskTitle: task.title,
        dueDate: task.dueDate,
        recommendedStartDate: prepStartDate
      };
    }
    
    return res.json({
      success: true,
      data: {
        month: targetMonth,
        year: targetYear,
        weeklyLoadTrend,
        monthlySummary: {
          totalDeadlines,
          peakDays,
          safeDays,
          planAdherence
        },
        aiTip,
        deadlinesByDate: dailyLoadMap
      }
    });
    
  } catch (err) {
    console.error('Calendar stats error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Helper function for ordinal suffix
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};