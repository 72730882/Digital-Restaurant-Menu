import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRouter from "./Routes/foodRoute.js";
import connectCloudinary from './config/cloudinary.js';
import categoryRouter from "./Routes/categoryRoutes.js";

dotenv.config();
connectDB();
connectCloudinary()

const app = express();
// Middleware
// Allow requests from your frontend
app.use(cors())

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req, res) => {
  res.send("Restaurant Menu API is running...");
});

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Please verify MONGO_URI in environment variables.",
      error: err.message,
      data: []
    });
  }
});

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/category", categoryRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
