import Workload from "../models/Workload.js";
import Deadline from "../models/Deadline.js";
import {
  getWeekStart,
  getDashboardAlerts,
  getDashboardSummary,
  syncUpcomingWorkloadsForUser,
} from "../models/dashboardscreenmodel.js";

/**
 * GET /api/insights
 *
 * Returns a consolidated insights payload for the logged-in user:
 *   - weekly_trend        : workload scores per week (for bar/line chart)
 *   - risk_pattern         : distribution of risk levels across upcoming weeks
 *   - current_week         : this week's workload snapshot
 *   - peak_week            : the upcoming week with the highest load
 *   - week_over_week       : % change between current and previous week
 *   - total_overload_weeks : how many upcoming weeks are high/critical
 *   - alerts               : high/critical week alerts
 *   - deadline_type_distribution : count of upcoming deadlines grouped by type
 *   - smart_insights       : auto-generated textual insights based on data
 */
export const getInsights = async (req, res) => {
  try {
    const user_id = req.user.id;

    // ── 1. Ensure workloads are fresh ──────────────────────────────────
    const currentWeekStart = getWeekStart(new Date());
    const existingWorkload = await Workload.findOne({
      user_id,
      week_start: { $gte: currentWeekStart },
    }).lean();

    if (!existingWorkload) {
      await syncUpcomingWorkloadsForUser(user_id);
    }

    // ── 2. Fetch weekly workload data (trend) ──────────────────────────
    const weeks = await Workload.find({ user_id })
      .sort({ week_start: 1 })
      .populate("deadlines", "title type dueDate weight impact_level course")
      .lean();

    const weekly_trend = weeks.map((w) => ({
      week_start: w.week_start,
      week_end: w.week_end,
      load_score: w.load_score,
      risk_level: w.risk_level,
      deadline_count: w.deadline_count,
      deadlines: w.deadlines,
    }));

    // ── 3. Risk-level distribution across upcoming weeks ───────────────
    const upcomingWeeks = weeks.filter(
      (w) => new Date(w.week_start) >= currentWeekStart
    );
    const risk_pattern = { low: 0, moderate: 0, high: 0, critical: 0 };
    for (const w of upcomingWeeks) {
      risk_pattern[w.risk_level] = (risk_pattern[w.risk_level] || 0) + 1;
    }

    // ── 4. Current week & previous week for comparison ─────────────────
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

    // ── 5. Peak week (highest load among upcoming) ─────────────────────
    const peak_week = upcomingWeeks.reduce(
      (max, w) => (w.load_score > (max?.load_score ?? 0) ? w : max),
      null
    );

    // ── 6. Overload week count ─────────────────────────────────────────
    const total_overload_weeks = upcomingWeeks.filter((w) =>
      ["high", "critical"].includes(w.risk_level)
    ).length;

    // ── 7. Alerts (high/critical) ──────────────────────────────────────
    const alerts = await getDashboardAlerts(user_id);

    // ── 8. Deadline type distribution (upcoming, not completed) ────────
    const upcomingDeadlines = await Deadline.find({
      user_id,
      is_completed: false,
      dueDate: { $gte: new Date() },
    })
      .select("type weight course dueDate")
      .lean();

    const deadline_type_distribution = {};
    for (const dl of upcomingDeadlines) {
      deadline_type_distribution[dl.type] =
        (deadline_type_distribution[dl.type] || 0) + 1;
    }

    // ── 9. Smart insights (auto-generated) ─────────────────────────────
    const smart_insights = [];

    if (alerts.length > 0) {
      smart_insights.push({
        type: "warning",
        title: "High Workload Detected",
        message: `You have ${alerts.length} upcoming overload week${alerts.length > 1 ? "s" : ""}. Consider starting preparation early.`,
      });
    }

    if (peak_week && peak_week.load_score > 0) {
      const peakDate = new Date(peak_week.week_start).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "short" }
      );
      smart_insights.push({
        type: "info",
        title: "Peak Week Ahead",
        message: `Your busiest week starts ${peakDate} with ${peak_week.deadline_count} deadline${peak_week.deadline_count !== 1 ? "s" : ""} and a load score of ${peak_week.load_score}.`,
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

    // Clustering warning: if 2+ overload weeks are consecutive
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
        break; // only one such warning
      }
    }

    // Heavy type warning
    const heavyTypes = ["exam", "midterm", "final"];
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

    // ── 10. Respond ────────────────────────────────────────────────────
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
