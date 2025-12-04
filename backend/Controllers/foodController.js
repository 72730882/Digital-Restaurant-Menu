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

// Add food (no multer)
const addFood = async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload Base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(image, { folder: "foods" });

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
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel
      .find({})
      .populate("category", "name");

    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.json({ success: false, message: "Food not found" });

    // Delete old image from Cloudinary
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

const updateFood = async (req, res) => {
  try {
    const { id, name, category, price, image, imagePublicId } = req.body;

    if (!id) {
      return res.json({ success: false, message: "Food ID is required" });
    }

    let updatedData = { name, category, price };
    let newImageUrl = image;
    let newImagePublicId = imagePublicId;

    // Check if the image is a new file (Base64)
    if (typeof image === "string" && image.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "foods",
      });

      // Delete old image if it exists
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    }

    // Update food document
    await foodModel.findByIdAndUpdate(id, {
      ...updatedData,
      image: newImageUrl,
      imagePublicId: newImagePublicId,
    });

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating food" });
  }
};


export { addFood, listFood, removeFood, updateFood, adminLogin };
