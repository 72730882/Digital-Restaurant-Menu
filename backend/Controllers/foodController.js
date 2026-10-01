import foodModel from "../Models/foodModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";

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
    console.error("Admin Login Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Add food
const addFood = async (req, res) => {
  try {
    await connectCloudinary();
    const { name, price, category } = req.body;

    let imageUrl = "";
    let imagePublicId = "";

    // Check if file exists in the request (multipart buffer)
    if (req.file && req.file.buffer) {
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "foods",
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.startsWith("data:")) {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "foods",
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim() !== "") {
      imageUrl = req.body.image.trim();
    } else {
      return res.json({ success: false, message: "Image is required" });
    }

    const food = new foodModel({
      name,
      price: Number(price) || 0,
      category,
      image: imageUrl,
      imagePublicId,
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
    let foods = [];
    try {
      foods = await foodModel.find({}).populate("category", "name");
    } catch (popError) {
      console.warn("Populate failed, falling back to unpopulated find:", popError);
      foods = await foodModel.find({});
    }
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List Food Error:", error);
    res.json({ success: false, message: "Error fetching foods", data: [] });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    await connectCloudinary();
    const { id } = req.body;
    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    // Delete image from Cloudinary if public ID exists
    if (food.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(food.imagePublicId);
      } catch (destroyErr) {
        console.warn("Could not delete image from Cloudinary:", destroyErr);
      }
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Remove Food Error:", error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food
const updateFood = async (req, res) => {
  try {
    await connectCloudinary();
    const { id, name, price, category } = req.body;

    if (!id) return res.json({ success: false, message: "Food ID is required" });

    const food = await foodModel.findById(id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    let newImageUrl = food.image;
    let newImagePublicId = food.imagePublicId;

    // Check if a new file was uploaded
    if (req.file && req.file.buffer) {
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadRes = await cloudinary.uploader.upload(fileBase64, { 
        folder: "foods" 
      });

      if (food.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(food.imagePublicId);
        } catch (destroyErr) {
          console.warn("Could not delete old image:", destroyErr);
        }
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(req.body.image, { 
        folder: "foods" 
      });

      if (food.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(food.imagePublicId);
        } catch (destroyErr) {
          console.warn("Could not delete old image:", destroyErr);
        }
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    }

    // Update the database with new details
    const updated = await foodModel.findByIdAndUpdate(
      id,
      {
        name,
        price: Number(price) || food.price,
        category,
        image: newImageUrl,
        imagePublicId: newImagePublicId,
      },
      { new: true }
    );

    res.json({ success: true, message: "Food updated successfully", data: updated });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.json({ success: false, message: error.message || "Error updating food" });
  }
};

export { addFood, listFood, removeFood, updateFood, adminLogin };

