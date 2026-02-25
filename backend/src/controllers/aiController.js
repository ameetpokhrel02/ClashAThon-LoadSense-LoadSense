import { GoogleGenerativeAI } from "@google/generative-ai";
import Deadline from "../models/Deadline.js";
import Workload from "../models/Workload.js";
import Module from "../models/Module.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Monday of the week for any given date
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

/**
 * POST /api/ai/suggestion
 * Generates an AI-powered study plan based on user's workload and deadlines
 */
export const generateStudyPlan = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Fetch user's upcoming deadlines
    const deadlines = await Deadline.find({
      dueDate: { $gte: new Date() },
    }).sort({ dueDate: 1 });

    if (!deadlines.length) {
      return res.json({
        success: true,
        message: "No upcoming deadlines found",
        data: {
          workloadSummary: {
            riskLevel: "low",
            message: "You have no upcoming deadlines. Enjoy your free time!",
          },
          priorityTasks: [],
          aiSuggestions: ["Take this opportunity to review past materials or get ahead on future topics."],
          weeklyPlan: [],
        },
      });
    }

    // 2. Fetch user's modules/courses for credit info
    const modules = await Module.find({ user: userId });
    const moduleMap = {};
    modules.forEach((m) => {
      moduleMap[m.title.toLowerCase()] = m.credits;
      moduleMap[m.moduleCode.toLowerCase()] = m.credits;
    });

    // 3. Fetch current workload data
    const currentWeekStart = getWeekStart(new Date());
    const workloads = await Workload.find({
      user_id: userId,
      week_start: { $gte: currentWeekStart },
    })
      .sort({ week_start: 1 })
      .limit(4);

    // 4. Calculate priority for each deadline
    const taskWeights = {
      "final exam": 5,
      "final": 5,
      "midterm": 4,
      "project": 3,
      "presentation": 3,
      "quiz": 2,
      "assignment": 1,
      "homework": 1,
      "lab": 2,
      "viva": 3,
      "report": 2,
    };

    const priorityTasks = deadlines.map((dl) => {
      const typeLower = dl.type.toLowerCase();
      const courseLower = dl.course.toLowerCase();

      // Get base weight from task type
      let baseWeight = 1;
      for (const [key, weight] of Object.entries(taskWeights)) {
        if (typeLower.includes(key)) {
          baseWeight = weight;
          break;
        }
      }

      // Get course credits (default to 3 if not found)
      const credits = moduleMap[courseLower] || 3;

      // Calculate adjusted weight
      const adjustedWeight = baseWeight * credits;

      // Calculate urgency based on days until due
      const daysUntilDue = Math.ceil(
        (new Date(dl.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: dl._id,
        title: dl.title,
        course: dl.course,
        type: dl.type,
        dueDate: dl.dueDate,
        formattedDueDate: formatDate(dl.dueDate),
        estimatedHours: dl.estimatedHours,
        baseWeight,
        credits,
        adjustedWeight,
        daysUntilDue,
        urgencyScore: adjustedWeight / Math.max(daysUntilDue, 1), // Higher = more urgent
      };
    });

    // Sort by urgency score (highest first)
    priorityTasks.sort((a, b) => b.urgencyScore - a.urgencyScore);

    // 5. Determine overall risk level
    const totalLoad = priorityTasks.reduce((sum, t) => sum + t.adjustedWeight, 0);
    const avgDailyLoad = totalLoad / 7;

    let riskLevel = "low";
    let riskMessage = "Your workload looks manageable this week.";

    if (avgDailyLoad >= 10 || priorityTasks.some(t => t.daysUntilDue <= 2 && t.adjustedWeight >= 10)) {
      riskLevel = "critical";
      riskMessage = "🔴 Critical overload detected! You have multiple high-priority tasks due soon.";
    } else if (avgDailyLoad >= 6 || priorityTasks.some(t => t.daysUntilDue <= 3 && t.adjustedWeight >= 6)) {
      riskLevel = "high";
      riskMessage = "🟠 High workload week ahead. Plan carefully to avoid burnout.";
    } else if (avgDailyLoad >= 3) {
      riskLevel = "medium";
      riskMessage = "🟡 Moderate workload. Stay organized to keep on track.";
    }

    // 6. Prepare context for Gemini AI
    const taskListForAI = priorityTasks.slice(0, 10).map((t) => ({
      title: t.title,
      course: t.course,
      type: t.type,
      dueDate: t.formattedDueDate,
      daysUntilDue: t.daysUntilDue,
      estimatedHours: t.estimatedHours,
      priority: t.adjustedWeight,
    }));

    const prompt = `You are an AI study planner for a university student. Based on their upcoming tasks, create a practical study plan.

STUDENT'S UPCOMING TASKS:
${JSON.stringify(taskListForAI, null, 2)}

CURRENT RISK LEVEL: ${riskLevel}

Please provide:
1. 3-5 actionable study suggestions (short, practical tips)
2. A day-by-day study schedule for the next 5-7 days

Respond in this exact JSON format:
{
  "suggestions": [
    "Start with the highest priority task: [task name]",
    "Break down [large task] into smaller chunks",
    "..."
  ],
  "weeklyPlan": [
    {
      "day": "Monday",
      "date": "Feb 25",
      "tasks": [
        { "task": "Task description", "hours": 2, "course": "CS301" }
      ],
      "totalHours": 2
    }
  ]
}

Keep suggestions concise and actionable. Distribute work evenly across days, prioritizing urgent high-weight tasks first. Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}.`;

    // 7. Call Gemini AI
    let aiSuggestions = [];
    let weeklyPlan = [];

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiSuggestions = parsed.suggestions || [];
        weeklyPlan = parsed.weeklyPlan || [];
      }
    } catch (aiError) {
      console.error("Gemini AI Error:", aiError.message);

      // Fallback suggestions if AI fails
      aiSuggestions = [
        `Focus on "${priorityTasks[0]?.title}" first - it has the highest priority.`,
        "Break large tasks into 25-minute focused sessions (Pomodoro technique).",
        "Start early in the day when your energy is highest.",
        "Review your notes before starting each study session.",
        "Take short breaks between tasks to maintain focus.",
      ];

      // Fallback weekly plan
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const today = new Date();

      weeklyPlan = days.slice(0, 5).map((day, i) => {
        const planDate = new Date(today);
        planDate.setDate(today.getDate() + i);

        const tasksForDay = priorityTasks
          .filter((t) => t.daysUntilDue >= i && t.daysUntilDue <= i + 2)
          .slice(0, 2);

        return {
          day,
          date: planDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          tasks: tasksForDay.map((t) => ({
            task: `${t.type}: ${t.title}`,
            hours: Math.min(t.estimatedHours, 3),
            course: t.course,
          })),
          totalHours: tasksForDay.reduce((sum, t) => sum + Math.min(t.estimatedHours, 3), 0),
        };
      });
    }

    // 8. Send response
    res.json({
      success: true,
      data: {
        workloadSummary: {
          riskLevel,
          message: riskMessage,
          totalTasks: priorityTasks.length,
          totalEstimatedHours: priorityTasks.reduce((sum, t) => sum + t.estimatedHours, 0),
          totalAdjustedWeight: totalLoad,
        },
        priorityTasks: priorityTasks.slice(0, 10).map((t) => ({
          id: t.id,
          title: t.title,
          course: t.course,
          type: t.type,
          dueDate: t.dueDate,
          formattedDueDate: t.formattedDueDate,
          daysUntilDue: t.daysUntilDue,
          estimatedHours: t.estimatedHours,
          adjustedWeight: t.adjustedWeight,
          priority: t.adjustedWeight >= 10 ? "high" : t.adjustedWeight >= 5 ? "medium" : "low",
        })),
        aiSuggestions,
        weeklyPlan,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Study Plan Generation Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate study plan",
      error: err.message,
    });
  }
};
