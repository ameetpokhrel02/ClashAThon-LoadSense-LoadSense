import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing");
    return res.status(500).json({ message: "Server error: JWT_SECRET not defined" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token using the _id from the token payload
    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      // This case handles a valid token for a user that has been deleted
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    return next();
  } catch (err) {
    console.error("JWT verify error:", err.name, err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;