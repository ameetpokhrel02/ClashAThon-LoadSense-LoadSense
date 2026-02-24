import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema({
  title: String,
  type: String,
  due_date: Date,
  impact_level: String,
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

export default mongoose.model("Deadline", deadlineSchema);