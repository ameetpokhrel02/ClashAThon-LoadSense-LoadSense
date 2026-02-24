import mongoose from "mongoose";

const workloadSchema = new mongoose.Schema({
  week_start: Date,
  load_score: Number,
  risk_level: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Workload", workloadSchema);