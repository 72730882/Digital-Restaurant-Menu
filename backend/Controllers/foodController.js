import foodModel from "../Models/foodModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token, message: "Logged in successfully" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add food
const addFood = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Check if file exists in the request
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Convert buffer to Base64 for Cloudinary
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "foods",
    });

    const food = new foodModel({
      name,
      price,
      category,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully", data: food });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.json({ success: false, message: error.message || "Error adding food" });
  }
};

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}).populate("category", "name");
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    // Delete image from Cloudinary
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId);
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food
const updateFood = async (req, res) => {
  try {
    const { id, name, price, category } = req.body;

    if (!id) return res.json({ success: false, message: "Food ID is required" });

    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    let newImageUrl = food.image;
    let newImagePublicId = food.imagePublicId;

    // Check if a new file was uploaded (same logic as addFood)
    if (req.file) {
      // Convert buffer to Base64 (since this worked for your addFood)
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      
      const uploadRes = await cloudinary.uploader.upload(fileBase64, { 
        folder: "foods" 
      });

      // DELETE the old image from Cloudinary to keep your storage clean
      if (food.imagePublicId) {
        await cloudinary.uploader.destroy(food.imagePublicId);
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    }

    // Update the database with new details
    await foodModel.findByIdAndUpdate(id, {
      name,
      price,
      category,
      image: newImageUrl,
      imagePublicId: newImagePublicId,
    });

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.json({ success: false, message: "Error updating food" });
  }

};



export { addFood, listFood, removeFood, updateFood, adminLogin };
