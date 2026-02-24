import Workload from "../models/Workload.js";
import Deadline from "../models/Deadline.js";

// Maps a weekly load score to a risk level based on how heavy the week is.
const getRiskLevel = (score) => {
  if (score >= 14) return "critical";
  if (score >= 9)  return "high";
  if (score >= 5)  return "moderate";
  return "low";
};

// Returns the Monday of the week for any given date.
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Groups all upcoming deadlines by week, sums their weights, and saves a Workload record per week.
export const calculateWorkload = async (req, res) => {
  try {
    const user_id = req.user.id;

    const deadlines = await Deadline.find({
      user_id,
      is_completed: false,
      due_date: { $gte: new Date() },
    }).populate("course_id", "course_name course_code");

    if (!deadlines.length) {
      return res.json({ message: "No upcoming deadlines found", weeks: [] });
    }

    // Put each deadline into its correct week bucket.
    const weekMap = {};
    for (const dl of deadlines) {
      const weekStart = getWeekStart(dl.due_date);
      const key = weekStart.toISOString();

      if (!weekMap[key]) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        weekMap[key] = {
          week_start: weekStart,
          week_end: weekEnd,
          load_score: 0,
          deadline_count: 0,
          deadlines: [],
        };
      }

      weekMap[key].load_score += dl.weight ?? 1;
      weekMap[key].deadline_count += 1;
      weekMap[key].deadlines.push(dl._id);
    }

    // Upsert a Workload document for each week.
    const results = [];
    for (const [, week] of Object.entries(weekMap)) {
      const risk_level = getRiskLevel(week.load_score);
      const workload = await Workload.findOneAndUpdate(
        { user_id, week_start: week.week_start },
        { ...week, risk_level, user_id },
        { upsert: true, new: true }
      );
      results.push(workload);
    }

    results.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));
    res.json({ message: "Workload calculated", weeks: results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Returns all weekly workload records for this user, sorted earliest first.
export const getWorkload = async (req, res) => {
  try {
    const user_id = req.user.id;
    const workloads = await Workload.find({ user_id })
      .sort({ week_start: 1 })
      .populate("deadlines", "title type due_date weight impact_level");
    res.json({ weeks: workloads });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Returns only the high and critical risk weeks so the frontend can show overload warnings.
export const getAlert = async (req, res) => {
  try {
    const user_id = req.user.id;

    const alerts = await Workload.find({
      user_id,
      risk_level: { $in: ["high", "critical"] },
      week_start: { $gte: new Date() },
    })
      .sort({ week_start: 1 })
      .populate("deadlines", "title type due_date weight impact_level course_id");

    if (!alerts.length) {
      return res.json({
        message: "No overload detected. Your schedule looks manageable!",
        alerts: [],
      });
    }

    const formatted = alerts.map((w) => ({
      week_start: w.week_start,
      week_end: w.week_end,
      risk_level: w.risk_level,
      load_score: w.load_score,
      deadline_count: w.deadline_count,
      tasks_causing_overload: w.deadlines,
      message:
        w.risk_level === "critical"
          ? "🔴 Critical overload! Multiple major evaluations this week. Plan ahead immediately."
          : "🟠 High workload detected. Consider starting preparations early.",
    }));

    res.json({ alerts: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Returns a dashboard summary showing the current week, the busiest upcoming week, and the next 8 weeks.
export const getWorkloadSummary = async (req, res) => {
  try {
    const user_id = req.user.id;
    const currentWeekStart = getWeekStart(new Date());

    const upcoming = await Workload.find({
      user_id,
      week_start: { $gte: currentWeekStart },
    })
      .sort({ week_start: 1 })
      .limit(8)
      .populate("deadlines", "title type due_date impact_level");

    const currentWeek = upcoming[0] ?? null;
    const peakWeek = upcoming.reduce(
      (max, w) => (w.load_score > (max?.load_score ?? 0) ? w : max),
      null
    );

    res.json({
      current_week: currentWeek,
      peak_week: peakWeek,
      upcoming_weeks: upcoming,
      total_overload_weeks: upcoming.filter((w) =>
        ["high", "critical"].includes(w.risk_level)
      ).length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};