import mongoose from "mongoose";

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