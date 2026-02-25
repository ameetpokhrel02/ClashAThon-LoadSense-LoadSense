import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Custom error handler for Multer
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    // Log the full error for debugging
    console.error("Multer Error:", err);

    // Send a user-friendly JSON response
    return res.status(400).json({
      success: false,
      message: "File upload failed. Please check the file or try again.",
      error: err.message,
    });
  }
  next();
};

// A user can only get their own profile
router.get("/profile", protect, getProfile);

// A user can only update their own profile
router.patch(
  "/profile",
  protect,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      // This wrapper catches errors from the upload middleware
      handleUploadErrors(err, req, res, next);
    });
  },
  updateProfile
);

export default router;