import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  course_name: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Course", courseSchema);