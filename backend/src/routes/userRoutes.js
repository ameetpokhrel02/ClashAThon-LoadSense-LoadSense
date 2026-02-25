import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// A user can only get their own profile
router.get("/profile", protect, getProfile);

// A user can only update their own profile
// upload.single("avatar") handles file upload (optional - passes through if no file)
router.patch(
  "/profile",
  protect,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err.message);
        // Return specific error messages for common issues
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 2MB.",
          });
        }
        if (err.message?.includes("credentials") || err.message?.includes("cloud_name")) {
          return res.status(500).json({
            success: false,
            message: "Server configuration error. Please contact support.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed. Please try again.",
        });
      }
      next();
    });
  },
  updateProfile
);

export default router;