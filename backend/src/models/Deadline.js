import mongoose from "mongoose";

const normalizeType = (value) => {
  if (value === undefined || value === null) return value;

  const raw = String(value).trim();
  const lowered = raw.toLowerCase();

  // Allow UI-friendly labels and normalize to canonical values
  const aliases = {
    assignment: "assignment",
    project: "project",
    "group project": "project",
    group_project: "project",

    quiz: "quiz",
    viva: "viva",
    midterm: "midterm",
    final: "final",

    exam: "exam",
    reading: "reading",
  };

  return aliases[lowered] ?? lowered;
};

// Impact weight used in workload score calculation
const IMPACT_WEIGHTS = {
  assignment: 1,
  reading: 1,
  quiz: 2,
  viva: 2,
  project: 3,
  exam: 4,
  midterm: 4,
  final: 5,
};

// Single, clean Deadline schema
const deadlineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    // Controlled set of types, aligned with frontend select values
    type: {
      type: String,
      set: normalizeType,
      enum: [
        "assignment",
        "reading",
        "quiz",
        "viva",
        "project",
        "exam",
        "midterm",
        "final",
      ],
      required: true,
    },
    dueDate: { type: Date, required: true },
    estimatedHours: { type: Number, required: true },
    // Risk can be derived from weight; caller may omit it
    risk: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    notes: { type: String, trim: true },
    // Derived fields for workload logic (not required from client)
    impact_level: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    weight: {
      type: Number,
      default: 1,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },

    // Associate deadline with logged-in user (required for workload + privacy)
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-set weight, impact_level, and risk based on type before saving
deadlineSchema.pre("save", function () {
  const w = IMPACT_WEIGHTS[this.type] ?? 1;
  this.weight = w;

  if (w <= 1) this.impact_level = "low";
  else if (w <= 2) this.impact_level = "medium";
  else if (w <= 3) this.impact_level = "high";
  else this.impact_level = "critical";

  // Derive simple risk band from weight
  if (w <= 1) this.risk = "low";
  else if (w <= 3) this.risk = "medium";
  else this.risk = "high";
});

export default mongoose.model("Deadline", deadlineSchema);