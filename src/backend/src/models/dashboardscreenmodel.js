import Workload from "./Workload.js";
import Deadline from "./Deadline.js";
import Module from "./Module.js";

// Maps a weekly load score to a risk level based on how heavy the week is.
// Thresholds (based on *credit-adjusted* load score)
// - 0–40: safe (low)
// - 41–80: moderate
// - 81+: overload (critical)
// Clustering rule: 2+ high-impact tasks in the same week => overload.
export const getRiskLevel = (score, { highImpactCount = 0 } = {}) => {
  if (highImpactCount >= 2) return "critical";
  if (score >= 81) return "critical";
  if (score >= 41) return "moderate";
  return "low";
};

// Returns the Monday of the week for any given date.
export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const calculateWorkloadForUser = async (user_id) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const deadlines = await Deadline.find({
    user_id,
    is_completed: false,
    dueDate: { $gte: todayStart },
  }).sort({ dueDate: 1 });

  if (!deadlines.length) {
    return [];
  }

  // Build a credits lookup (moduleCode -> credits) for fast credit multiplier.
  // Our Module credits are typically 1–6; scale them to "credit-hours" (e.g., 3 -> 15, 6 -> 30)
  const CREDIT_SCALE = 5;
  const DEFAULT_CREDITS = 3;

  const courseCodes = Array.from(
    new Set(
      deadlines
        .map((d) => String(d.course ?? "").trim())
        .filter(Boolean)
        .map((c) => c.toUpperCase())
    )
  );

  const modules = courseCodes.length
    ? await Module.find(
      { user: user_id, moduleCode: { $in: courseCodes } },
      "moduleCode credits"
    ).lean()
    : [];
  const creditsByCourse = new Map(modules.map((m) => [m.moduleCode, m.credits]));

  // Put each deadline into its correct week bucket.
  const weekMap = {};
  for (const dl of deadlines) {
    const weekStart = getWeekStart(dl.dueDate);
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
        high_impact_count: 0,
      };
    }

    const baseWeight = dl.weight ?? 1;
    const courseCode = String(dl.course ?? "").trim().toUpperCase();
    const credits = creditsByCourse.get(courseCode) ?? DEFAULT_CREDITS;
    const creditHours = credits * CREDIT_SCALE;
    const adjustedWeight = baseWeight * creditHours;

    // Weekly Load = sum of adjusted weights
    weekMap[key].load_score += adjustedWeight;
    weekMap[key].deadline_count += 1;
    weekMap[key].deadlines.push(dl._id);

    // High-impact clustering: treat midterm/exam/final (weight >= 4) as high impact.
    if (baseWeight >= 4) {
      weekMap[key].high_impact_count += 1;
    }
  }

  // Upsert a Workload document for each week.
  const results = [];
  for (const [, week] of Object.entries(weekMap)) {
    const risk_level = getRiskLevel(week.load_score, {
      highImpactCount: week.high_impact_count,
    });

    const { high_impact_count, ...persistedWeek } = week;
    const workload = await Workload.findOneAndUpdate(
      { user_id, week_start: week.week_start },
      {
        $set: {
          ...persistedWeek,
          user_id,
          risk_level,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    results.push(workload);
  }

  results.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));
  return results;
};

// Rebuild upcoming Workload docs so dashboard reflects latest deadlines.
// We scope deletion to upcoming weeks only, keeping historical workloads intact.
export const syncUpcomingWorkloadsForUser = async (user_id) => {
  const currentWeekStart = getWeekStart(new Date());

  await Workload.deleteMany({
    user_id,
    week_start: { $gte: currentWeekStart },
  });

  return await calculateWorkloadForUser(user_id);
};

const ensureUpcomingWorkloadsFresh = async (user_id) => {
  const currentWeekStart = getWeekStart(new Date());

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [latestDeadline, latestWorkload] = await Promise.all([
    Deadline.findOne({
      user_id,
      is_completed: false,
      dueDate: { $gte: todayStart },
    })
      .sort({ updatedAt: -1 })
      .select("updatedAt")
      .lean(),
    Workload.findOne({ user_id, week_start: { $gte: currentWeekStart } })
      .sort({ updatedAt: -1 })
      .select("updatedAt")
      .lean(),
  ]);

  // If there are no upcoming deadlines, nothing to compute.
  if (!latestDeadline) {
    return;
  }

  // If workloads are missing or older than the latest deadline mutation, rebuild.
  if (!latestWorkload || latestDeadline.updatedAt > latestWorkload.updatedAt) {
    await syncUpcomingWorkloadsForUser(user_id);
  }
};

export const getDashboardAlerts = async (user_id) => {
  await ensureUpcomingWorkloadsFresh(user_id);

  const currentWeekStart = getWeekStart(new Date());

  const alerts = await Workload.find({
    user_id,
    risk_level: { $in: ["high", "critical"] },
    week_start: { $gte: currentWeekStart },
  })
    .sort({ week_start: 1 })
    .populate("deadlines", "title type dueDate weight impact_level course");

  const formatted = alerts.map((w) => ({
    week_start: w.week_start,
    week_end: w.week_end,
    risk_level: w.risk_level,
    load_score: w.load_score,
    deadline_count: w.deadline_count,
    tasks_causing_overload: w.deadlines,
    message: "You are entering a high workload week.",
  }));

  return formatted;
};

export const getDashboardSummary = async (user_id, { limit = 8 } = {}) => {
  const currentWeekStart = getWeekStart(new Date());

  await ensureUpcomingWorkloadsFresh(user_id);

  let upcoming = await Workload.find({
    user_id,
    week_start: { $gte: currentWeekStart },
  })
    .sort({ week_start: 1 })
    .limit(limit)
    .populate("deadlines", "title type dueDate weight impact_level course");

  // If no upcoming weeks exist after sync, return an empty summary shape.

  const currentWeek = upcoming[0] ?? null;
  const peakWeek = upcoming.reduce(
    (max, w) => (w.load_score > (max?.load_score ?? 0) ? w : max),
    null
  );

  return {
    current_week: currentWeek,
    peak_week: peakWeek,
    upcoming_weeks: upcoming,
    total_overload_weeks: upcoming.filter((w) =>
      ["high", "critical"].includes(w.risk_level)
    ).length,
  };
};
