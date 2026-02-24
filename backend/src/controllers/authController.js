import User from "../models/User.js";

export const register = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  res.json(user);
};

export const getMe = async (req, res) => {
  res.json({ message: "Current user" });
};