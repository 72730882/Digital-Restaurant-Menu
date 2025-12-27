import express from "express";
import { addFood, listFood, removeFood, updateFood, adminLogin } from "../Controllers/foodController.js";
import upload from "../middleware/multer.js"; // Import the multer config

const foodRouter = express.Router();

// Routes
foodRouter.post("/add", upload.single("image"), addFood);        // Add food
foodRouter.get("/list", listFood);       // List all foods
foodRouter.post("/remove", removeFood);  // Remove food
foodRouter.post("/update",upload.single("image"), updateFood);  // Update food
foodRouter.post("/admin", adminLogin);   // Admin login

export default foodRouter;
