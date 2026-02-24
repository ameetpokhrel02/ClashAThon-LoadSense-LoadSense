import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile);

export default router;
