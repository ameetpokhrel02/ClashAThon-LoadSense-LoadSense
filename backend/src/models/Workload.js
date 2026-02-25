import mongoose from "mongoose";

const workloadSchema = new mongoose.Schema(
  {
    week_start: {
      type: Date,
      required: true,
    },
    week_end: {
      type: Date,
      required: true,
    },
    // Sum of deadline weights in this week
    load_score: {
      type: Number,
      default: 0,
    },
    // low | moderate | high | critical
    risk_level: {
      type: String,
      enum: ["low", "moderate", "high", "critical"],
      default: "low",
    },
    // How many deadlines fall in this week
    deadline_count: {
      type: Number,
      default: 0,
    },
    // IDs of deadlines contributing to this week's load
    deadlines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deadline",
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workload", workloadSchema);