// AI Study Plan Suggestion Controller
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAISuggestion = async (req, res) => {
  try {
    // Example: Use Gemini API or return a static suggestion
    // You can customize this logic to use deadlines, workload, etc.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For demo, return a static suggestion
    const suggestion = {
      success: true,
      data: {
        aiSuggestions: [
          "Review your notes daily.",
          "Focus on high-impact tasks first.",
          "Take regular breaks for better retention."
        ],
        weeklyPlan: [
          { day: "Monday", tasks: ["Read Chapter 1", "Practice problems"] },
          { day: "Tuesday", tasks: ["Attend lecture", "Group study"] },
          { day: "Wednesday", tasks: ["Review assignments", "Quiz prep"] },
          { day: "Thursday", tasks: ["Lab work", "Revise notes"] },
          { day: "Friday", tasks: ["Mock test", "Feedback review"] },
          { day: "Saturday", tasks: ["Rest", "Light revision"] },
          { day: "Sunday", tasks: ["Plan next week", "Set goals"] }
        ]
      }
    };
    return res.json(suggestion);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to generate AI study plan", error: err.message });
  }
};
