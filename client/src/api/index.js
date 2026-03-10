import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/",
});

export const GetPosts = async () => await API.get("/post/");
export const CreatePost = async (data) => await API.post("/post/", data);
export const GenerateAIImage = async (data) =>
  await API.post("/generateImage/", data);

// Auth APIs
export const Signup = async (data) => await API.post("/auth/signup", data);
export const Login = async (data) => await API.post("/auth/login", data);
export const VerifyOTP = async (data) => await API.post("/auth/verify-otp", data);
export const ForgotPassword = async (data) => await API.post("/auth/forgot-password", data);
export const ResetPassword = async (data) => await API.post("/auth/reset-password", data);
