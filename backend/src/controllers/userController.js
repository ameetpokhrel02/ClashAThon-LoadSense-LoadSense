import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    // Get user from the protect middleware, no need for params
    const user = await User.findById(req.user._id).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, ward } = req.body;
    // Get user from the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error("User not found for ID:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updating fields for user:", user.email);
    console.log("Req body:", req.body);
    console.log("Req file:", req.file ? "File present" : "No file");

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();
    if (ward !== undefined) user.ward = ward.trim();

    if (req.file) {
      // If user had a previous avatar that isn't the default, delete it from Cloudinary
      if (user.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(user.avatarPublicId);
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
        }
      }

      user.avatar = req.file.path;
      // ...existing code...
      user.avatarPublicId = req.file.filename;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        ward: updatedUser.ward,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors: err.errors,
      });
    }

    // Generic server error
    console.error("Update Profile Error details:", err.message, err.stack); // Log the full error for debugging
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred on the server."
    });
  }
};
