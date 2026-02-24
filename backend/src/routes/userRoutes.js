import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Routes are now identified by :id instead of token
router.get("/profile/:id", getProfile);
router.put("/profile/:id", upload.single("avatar"), updateProfile);

export default router;
