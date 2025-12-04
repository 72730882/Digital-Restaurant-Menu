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
app.use(
  cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],  // your frontend URL
    credentials: true,
  })
);
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Restaurant Menu API is running...");
});

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/category", categoryRouter);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
