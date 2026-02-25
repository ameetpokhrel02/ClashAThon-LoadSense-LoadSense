import Deadline from "../models/Deadline.js";
import { syncUpcomingWorkloadsForUser } from "../models/dashboardscreenmodel.js";

// Create a new deadline
export const addDeadline = async (req, res) => {
  try {
    const { title, course, type, dueDate, estimatedHours, risk, notes } = req.body;

    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !course || !type || !dueDate || estimatedHours === undefined || estimatedHours === null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const deadline = await Deadline.create({
      title,
      course,
      type,
      dueDate,
      estimatedHours,
      risk,
      notes,
      user_id,
    });

    // Keep dashboard/workload views in sync with the latest deadlines.
    await syncUpcomingWorkloadsForUser(user_id);

    return res.status(201).json(deadline);
  } catch (error) {
    console.error("Error creating deadline", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to create deadline" });
  }
};

// Get all deadlines (for now, not scoped per user)
export const getDeadlines = async (_req, res) => {
  try {
    const user_id = _req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deadlines = await Deadline.find({ user_id }).sort({ dueDate: 1 });
    return res.json(deadlines);
  } catch (error) {
    console.error("Error fetching deadlines", error);
    return res.status(500).json({ message: "Failed to fetch deadlines" });
  }
};

// Delete a deadline by id
export const deleteDeadline = async (req, res) => {
  try {
    const { id } = req.params;

    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await Deadline.findOne({ _id: id, user_id });
    if (!existing) {
      return res.status(404).json({ message: "Deadline not found" });
    }

    await existing.deleteOne();

    // Re-sync because removing a deadline can leave stale workload weeks.
    await syncUpcomingWorkloadsForUser(user_id);
    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting deadline", error);
    return res.status(500).json({ message: "Failed to delete deadline" });
  }
};

// Update a deadline (currently supports completion toggle)
export const updateDeadline = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;

    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof is_completed !== "boolean") {
      return res.status(400).json({ message: "is_completed must be a boolean" });
    }

    const updated = await Deadline.findOneAndUpdate(
      { _id: id, user_id },
      { is_completed },
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Deadline not found" });
    }

    // Completion status affects which deadlines are included in upcoming workload.
    await syncUpcomingWorkloadsForUser(user_id);

    return res.json(updated);
  } catch (error) {
    console.error("Error updating deadline", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to update deadline" });
  }
};