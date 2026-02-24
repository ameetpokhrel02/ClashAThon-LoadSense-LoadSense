import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";


const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LoadSense" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset OTP - LoadSense",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px;">
        <h2 style="color:#4F46E5;">LoadSense Password Reset</h2>
        <p>Hi there,</p>
        <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:16px 0;color:#4F46E5;">
          ${otp}
        </div>
        <p style="color:#888;font-size:12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};


export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !firstName.trim())
      return res.status(400).json({ message: "First name is required" });
    if (!lastName || !lastName.trim())
      return res.status(400).json({ message: "Last name is required" });
    if (!email || !email.trim())
      return res.status(400).json({ message: "Email is required" });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Please enter a valid email" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "Email is already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = signToken(user);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !email.trim())
      return res.status(400).json({ message: "Email is required" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim())
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    await sendOtpEmail(user.email, otp);

    res.json({ message: "OTP sent to your email. It expires in 10 minutes." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "No OTP requested. Please request a new one." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP, and new password are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "No OTP requested. Please request a new one." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};