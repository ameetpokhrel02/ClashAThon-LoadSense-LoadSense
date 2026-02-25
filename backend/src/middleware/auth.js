import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  // debug logs - remove in production
  console.log("Authorization header:", authHeader);
  console.log("Token length:", token ? token.length : "no token");

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing");
    return res.status(500).json({ message: "Server error: JWT_SECRET not defined" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT verified. Decoded:", decoded);
    req.user = { _id: decoded._id || decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    console.error("JWT verify error:", err.name, err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;