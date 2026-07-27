import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import foodModel from "./Models/foodModel.js"; // Adjust path to your foodModel if needed
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const restoreDatabase = async () => {
  try {
    // 1. Connect to your new MongoDB cluster
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to new MongoDB cluster...");

    // 2. Fetch all images stored in your Cloudinary 'foods' folder
    console.log("Fetching images from Cloudinary...");
    const { resources } = await cloudinary.search
      .expression('folder:foods')
      .max_results(100)
      .execute();

    if (resources.length === 0) {
      console.log("No images found in Cloudinary 'foods' folder.");
      process.exit(0);
    }

    console.log(`Found ${resources.length} images on Cloudinary. Restoring to MongoDB...`);

    // 3. Loop through each image and recreate the database entry
    for (const file of resources) {
      // Use a valid 24-character dummy MongoDB ObjectId hex string for the category
      const dummyCategoryId = "507f1f77bcf86cd799439011";

      const foodItem = {
        name: file.filename || "Restored Item",
        price: 0, // Default price, can be updated later from admin panel
        category: dummyCategoryId, 
        image: file.secure_url,
        imagePublicId: file.public_id,
      };

      // Check if it already exists to avoid duplicates
      const existing = await foodModel.findOne({ imagePublicId: file.public_id });
      if (!existing) {
        await foodModel.create(foodItem);
        console.log(`Restored: ${file.filename}`);
      } else {
        console.log(`Skipped (already exists): ${file.filename}`);
      }
    }

    console.log("Data restoration from Cloudinary completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Restoration Error:", error);
    process.exit(1);
  }
};

restoreDatabase();