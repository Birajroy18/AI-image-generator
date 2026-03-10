import express from "express";
import {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/Auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
