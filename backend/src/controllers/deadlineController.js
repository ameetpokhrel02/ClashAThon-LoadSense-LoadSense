import Deadline from "../models/Deadline.js";

// Create a new deadline
export const addDeadline = async (req, res) => {
  try {
    const { title, course, type, dueDate, estimatedHours, risk, notes } = req.body;

    if (!title || !course || !type || !dueDate || !estimatedHours) {
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
    });

    return res.status(201).json(deadline);
  } catch (error) {
    console.error("Error creating deadline", error);
    return res.status(500).json({ message: "Failed to create deadline" });
  }
};

// Get all deadlines (for now, not scoped per user)
export const getDeadlines = async (_req, res) => {
  try {
    const deadlines = await Deadline.find().sort({ dueDate: 1 });
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

    const existing = await Deadline.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Deadline not found" });
    }

    await existing.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting deadline", error);
    return res.status(500).json({ message: "Failed to delete deadline" });
  }
};