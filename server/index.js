import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";
import AuthRouter from "./routes/Auth.js";

dotenv.config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000', // React dev server
    'http://localhost:8080', // Alternative dev port
    process.env.FRONTEND_URL || 'https://your-netlify-site.netlify.app' // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);
app.use("/api/auth", AuthRouter);

//Default get
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello Developers!",
    status: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get("/health", async (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

//function to connect to mongodb
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
};

//function to start the server
const startServer = async () => {
  try {
    connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
