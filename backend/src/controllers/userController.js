import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
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
    const user = await User.findById(req.user.id);

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
      user.avatarPublicId = req.file.filename; // filename is the public_id for multer-storage-cloudinary
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
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
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
