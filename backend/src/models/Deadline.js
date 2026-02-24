import mongoose from "mongoose";

// Impact weight used in workload score calculation
// assignment=1, quiz=2, viva=2, group_project=3, midterm=4, final=5
const IMPACT_WEIGHTS = {
  assignment: 1,
  quiz: 2,
  viva: 2,
  group_project: 3,
  midterm: 4,
  final: 5,
};

const deadlineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["assignment", "quiz", "viva", "group_project", "midterm", "final"],
      required: [true, "Type is required"],
    },
    due_date: {
      type: Date,
      required: [true, "Due date is required"],
    },
    // impact_level derived automatically from type
    impact_level: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    // numeric weight for workload calculation
    weight: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-set weight and impact_level based on type before saving
deadlineSchema.pre("save", function (next) {
  const w = IMPACT_WEIGHTS[this.type] ?? 1;
  this.weight = w;
  if (w <= 1) this.impact_level = "low";
  else if (w <= 2) this.impact_level = "medium";
  else if (w <= 3) this.impact_level = "high";
  else this.impact_level = "critical";
  next();
});

export default mongoose.model("Deadline", deadlineSchema);