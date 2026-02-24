import Deadline from "../models/Deadline.js";

export const addDeadline = async (req, res) => {
  const deadline = await Deadline.create(req.body);
  res.json(deadline);
};

export const getDeadlines = async (req, res) => {
  const deadlines = await Deadline.find();
  res.json(deadlines);
};

export const deleteDeadline = async (req, res) => {
  await Deadline.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};