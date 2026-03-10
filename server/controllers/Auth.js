import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendOTPEmail, sendPasswordResetEmail } from "../utils/emailService.js";

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup user
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode: otp,
      verificationCodeExpiry: otpExpiry,
    });

    await newUser.save();

    // Send OTP to email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({
      message: "User created. Verification code sent to email.",
      email,
      otp, // Remove in production
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Email not verified. Please verify your email.",
        email,
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP expiry
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check OTP
    if (user.verificationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = otp;
    user.verificationCodeExpiry = otpExpiry;
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    return res.status(200).json({
      message: "Password reset code sent to email",
      email,
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP
    if (user.verificationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
