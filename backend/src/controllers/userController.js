import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    // Get user from the protect middleware, no need for params
    const user = await User.findById(req.user._id).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return user with `id` field for frontend consistency
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        ward: user.ward,
        role: user.role,
        avatar: user.avatar,
      }
    });
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
      return res.status(404).json({ message: "User not found" });
    }

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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred on the server."
    });
  }
};
