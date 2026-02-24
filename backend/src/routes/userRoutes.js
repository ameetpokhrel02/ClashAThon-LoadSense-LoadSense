import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Protect the routes: only logged-in users can access
router.get("/profile/:id", protect, getProfile);

// Protect + handle avatar upload
router.put("/profile/:id", protect, upload.single("avatar"), updateProfile);

export default router;