import Workload from "../models/Workload.js";

export const calculateWorkload = async (req, res) => {
  const workload = await Workload.create({
    load_score: 70,
    risk_level: "Moderate",
    user_id: req.body.user_id,
  });
  res.json(workload);
};

export const getWorkload = async (req, res) => {
  const data = await Workload.find();
  res.json(data);
};

export const getAlert = async (req, res) => {
  res.json({
    risk_level: "High",
    tasks_causing_overload: [],
  });
};