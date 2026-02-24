import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import workloadRoutes from "./routes/workloadRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/deadlines", deadlineRoutes);
app.use("/api/workload", workloadRoutes);