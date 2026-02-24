import mongoose from "mongoose";

// Deadline schema aligned with the frontend Deadline model
// Fields are kept simple for the hackathon use case and can
// be extended later (e.g. user-specific scoping, courses, etc.).
const deadlineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: String, required: true },
    type: { type: String, required: true },
    dueDate: { type: Date, required: true },
    estimatedHours: { type: Number, required: true },
    risk: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Deadline", deadlineSchema);