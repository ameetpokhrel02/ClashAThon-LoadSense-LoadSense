import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import workloadRoutes from "./routes/workloadRoutes.js";

import dashboardRoutes from "./routes/dashboardscreenRoutes.js";
import adminFeedbackRatingRoutes from "./routes/adminFeedbackRatingRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/deadlines", deadlineRoutes);
app.use("/api/workload", workloadRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/feedback-ratings", adminFeedbackRatingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reminders", reminderRoutes);
app.get("/", (req, res) => {
  res.send("LoadSense API Running ");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});