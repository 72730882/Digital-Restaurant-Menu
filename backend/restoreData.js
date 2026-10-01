import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import foodModel from "./Models/foodModel.js";
import categoryModel from "./Models/categoryModel.js";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const defaultCategoryData = [
  { name: "Breakfast", sampleName: "Breakfast" },
  { name: "Lunch", sampleName: "Lunch" },
  { name: "Dinner", sampleName: "Dinner" },
  { name: "Dessert", sampleName: "Dessert" },
  { name: "Hot Drinks", sampleName: "Hot Drinks" },
  { name: "Cold Drinks", sampleName: "Cold Drinks" },
  { name: "Fast Food", sampleName: "Fast Food" },
];

const sampleDishNames = [
  { name: "Special Burger", price: 350, cat: "Fast Food" },
  { name: "Chechebsa with Honey", price: 220, cat: "Breakfast" },
  { name: "Special Scrambled Eggs", price: 180, cat: "Breakfast" },
  { name: "Traditional Beef Tibs", price: 420, cat: "Lunch" },
  { name: "Spaghetti Bolognese", price: 320, cat: "Lunch" },
  { name: "Club Sandwich", price: 300, cat: "Fast Food" },
  { name: "Grilled Chicken Breast", price: 450, cat: "Dinner" },
  { name: "Roast Beef Steak", price: 580, cat: "Dinner" },
  { name: "Fish Cutlet", price: 380, cat: "Lunch" },
  { name: "Doro Wot Special", price: 480, cat: "Dinner" },
  { name: "Special Firfir with Meat", price: 260, cat: "Breakfast" },
  { name: "Pancake Tower", price: 240, cat: "Breakfast" },
  { name: "Belgian Waffles", price: 260, cat: "Dessert" },
  { name: "Chocolate Fudge Cake", price: 220, cat: "Dessert" },
  { name: "Cheesecake Slice", price: 250, cat: "Dessert" },
  { name: "Ice Cream Trio", price: 180, cat: "Dessert" },
  { name: "Cappuccino Italiano", price: 120, cat: "Hot Drinks" },
  { name: "Caramel Macchiato", price: 140, cat: "Hot Drinks" },
  { name: "Special Spiced Tea", price: 80, cat: "Hot Drinks" },
  { name: "Hot Chocolate Delight", price: 130, cat: "Hot Drinks" },
  { name: "Fresh Mango Juice", price: 160, cat: "Cold Drinks" },
  { name: "Avocado Special Smoothie", price: 180, cat: "Cold Drinks" },
  { name: "Layered Mixed Juice", price: 190, cat: "Cold Drinks" },
  { name: "Mint Lime Mojito", price: 170, cat: "Cold Drinks" },
  { name: "Crispy French Fries", price: 150, cat: "Fast Food" },
  { name: "Chicken Wings (6pcs)", price: 320, cat: "Fast Food" },
  { name: "Pizza Margherita", price: 420, cat: "Dinner" },
  { name: "Vegetable Pasta", price: 280, cat: "Lunch" },
  { name: "Naflet Chef Platter", price: 650, cat: "Dinner" },
];

const restoreDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully!");

    // 1. Restore/Ensure Categories
    console.log("Fetching category images from Cloudinary...");
    let catImages = [];
    try {
      const catRes = await cloudinary.search
        .expression("folder:categories")
        .max_results(50)
        .execute();
      catImages = catRes.resources || [];
    } catch (e) {
      console.warn("Could not fetch categories folder:", e.message);
    }

    const savedCategories = {};
    for (let i = 0; i < defaultCategoryData.length; i++) {
      const def = defaultCategoryData[i];
      let catImg = catImages[i] ? catImages[i].secure_url : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
      let publicId = catImages[i] ? catImages[i].public_id : "";

      let catDoc = await categoryModel.findOne({ name: def.name });
      if (!catDoc) {
        catDoc = await categoryModel.create({
          name: def.name,
          image: catImg,
          imagePublicId: publicId,
        });
        console.log(`Created Category: ${def.name}`);
      } else {
        console.log(`Existing Category: ${def.name}`);
      }
      savedCategories[def.name] = catDoc._id;
    }

    // 2. Fetch all images stored in Cloudinary 'foods' folder
    console.log("Fetching food images from Cloudinary...");
    const { resources } = await cloudinary.search
      .expression("folder:foods")
      .max_results(100)
      .execute();

    if (!resources || resources.length === 0) {
      console.log("No images found in Cloudinary 'foods' folder.");
      process.exit(0);
    }

    console.log(`Found ${resources.length} food images on Cloudinary. Syncing to MongoDB...`);

    const categoryKeys = Object.keys(savedCategories);

    for (let idx = 0; idx < resources.length; idx++) {
      const file = resources[idx];
      const preset = sampleDishNames[idx % sampleDishNames.length];
      const categoryId = savedCategories[preset.cat] || savedCategories[categoryKeys[idx % categoryKeys.length]];

      const existing = await foodModel.findOne({ imagePublicId: file.public_id });
      if (!existing) {
        await foodModel.create({
          name: preset.name,
          price: preset.price,
          category: categoryId,
          image: file.secure_url,
          imagePublicId: file.public_id,
        });
        console.log(`Added Food [${preset.name}] -> Category: ${preset.cat}, Image: ${file.public_id}`);
      } else {
        console.log(`Skipped existing Food [${existing.name}] (${file.public_id})`);
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