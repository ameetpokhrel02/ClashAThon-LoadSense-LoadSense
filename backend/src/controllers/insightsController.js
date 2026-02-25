import Workload from "../models/Workload.js";
import Deadline from "../models/Deadline.js";
import {
  getWeekStart,
  getDashboardAlerts,
  syncUpcomingWorkloadsForUser,
} from "../models/dashboardscreenmodel.js";

export const getInsights = async (req, res) => {
  try {
    const user_id = req.user.id;

    // ── 1. Ensure workloads are fresh ───────────────────────────────
    const currentWeekStart = getWeekStart(new Date());

    const existingWorkload = await Workload.findOne({
      user_id,
      week_start: { $gte: currentWeekStart },
    }).lean();

    if (!existingWorkload) {
      await syncUpcomingWorkloadsForUser(user_id);
    }

    // ── 2. Fetch weekly workload data ───────────────────────────────
    const weeks = await Workload.find({ user_id })
      .sort({ week_start: 1 })
      .populate("deadlines", "title type dueDate weight impact_level")
      .lean();

    const weekly_trend = weeks.map((w) => ({
      week_start: w.week_start,
      week_end: w.week_end,
      load_score: w.load_score,
      risk_level: w.risk_level,
      deadline_count: w.deadline_count,
      deadlines: w.deadlines,
    }));

    // ── 3. Risk distribution ───────────────────────────────────────
    const upcomingWeeks = weeks.filter(
      (w) => new Date(w.week_start) >= currentWeekStart
    );

    const risk_pattern = { low: 0, moderate: 0, high: 0, critical: 0 };

    for (const w of upcomingWeeks) {
      risk_pattern[w.risk_level] =
        (risk_pattern[w.risk_level] || 0) + 1;
    }

    // ── 4. Current & previous week comparison ───────────────────────
    const current_week =
      upcomingWeeks.find(
        (w) =>
          new Date(w.week_start).toISOString() ===
          currentWeekStart.toISOString()
      ) || null;

    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const previous_week =
      weeks.find(
        (w) =>
          new Date(w.week_start).toISOString() ===
          prevWeekStart.toISOString()
      ) || null;

    const currentLoad = current_week?.load_score ?? 0;
    const previousLoad = previous_week?.load_score ?? 0;

    const week_over_week = {
      current_load: currentLoad,
      previous_load: previousLoad,
      change: currentLoad - previousLoad,
      direction: currentLoad >= previousLoad ? "increasing" : "decreasing",
    };

    // ── 5. Peak week ───────────────────────────────────────────────
    const peak_week = upcomingWeeks.reduce(
      (max, w) => (w.load_score > (max?.load_score ?? 0) ? w : max),
      null
    );

    // ── 6. Overload week count ─────────────────────────────────────
    const total_overload_weeks = upcomingWeeks.filter((w) =>
      ["high", "critical"].includes(w.risk_level)
    ).length;

    // ── 7. Alerts ──────────────────────────────────────────────────
    const alerts = await getDashboardAlerts(user_id);

    // ── 8. Upcoming deadline type distribution ─────────────────────
    const upcomingDeadlines = await Deadline.find({
      user_id,
      is_completed: false,
      dueDate: { $gte: new Date() },
    })
      .select("type dueDate")
      .lean();

    const deadline_type_distribution = {};

    for (const dl of upcomingDeadlines) {
      deadline_type_distribution[dl.type] =
        (deadline_type_distribution[dl.type] || 0) + 1;
    }

    // ── 9. Smart Insights ──────────────────────────────────────────
    const smart_insights = [];

    if (alerts.length > 0) {
      smart_insights.push({
        type: "warning",
        title: "High Workload Detected",
        message: `You have ${alerts.length} upcoming overload week${
          alerts.length > 1 ? "s" : ""
        }. Consider starting preparation early.`,
      });
    }

    if (peak_week && peak_week.load_score > 0) {
      const peakDate = new Date(
        peak_week.week_start
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      smart_insights.push({
        type: "info",
        title: "Peak Week Ahead",
        message: `Your busiest week starts ${peakDate} with ${
          peak_week.deadline_count
        } deadline${
          peak_week.deadline_count !== 1 ? "s" : ""
        } and a load score of ${peak_week.load_score}.`,
      });
    }

    if (total_overload_weeks === 0 && upcomingWeeks.length > 0) {
      smart_insights.push({
        type: "success",
        title: "Workload Is Manageable",
        message:
          "No overload weeks detected. Your schedule looks well-balanced!",
      });
    }

    for (let i = 0; i < upcomingWeeks.length - 1; i++) {
      const a = upcomingWeeks[i];
      const b = upcomingWeeks[i + 1];

      if (
        ["high", "critical"].includes(a.risk_level) &&
        ["high", "critical"].includes(b.risk_level)
      ) {
        smart_insights.push({
          type: "warning",
          title: "Consecutive Overload Weeks",
          message:
            "You have back-to-back high-load weeks. Spread tasks out if possible to avoid burnout.",
        });
        break;
      }
    }

    const heavyTypes = ["midterm", "final"];
    const heavyCount = upcomingDeadlines.filter((d) =>
      heavyTypes.includes(d.type)
    ).length;

    if (heavyCount >= 2) {
      smart_insights.push({
        type: "info",
        title: "Multiple High-Stake Evaluations",
        message: `You have ${heavyCount} upcoming exams/midterms/finals. Prioritise revision early.`,
      });
    }

    return res.json({
      weekly_trend,
      risk_pattern,
      current_week,
      previous_week,
      peak_week,
      week_over_week,
      total_overload_weeks,
      alerts,
      deadline_type_distribution,
      smart_insights,
    });
  } catch (err) {
    console.error("Insights error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};