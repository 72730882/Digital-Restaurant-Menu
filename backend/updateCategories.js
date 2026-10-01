import mongoose from "mongoose";
import categoryModel from "./Models/categoryModel.js";
import dotenv from "dotenv";

dotenv.config();

const categoryMappings = [
  {
    name: "Breakfast",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766858706/foods/hokflwly3sr4plowbeyr.jpg",
    imagePublicId: "foods/hokflwly3sr4plowbeyr"
  },
  {
    name: "Lunch",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766858892/foods/zli6s1ldnkgboujqbsqb.jpg",
    imagePublicId: "foods/zli6s1ldnkgboujqbsqb"
  },
  {
    name: "Dinner",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766852989/categories/h8q4vs6uzkbzqj5rkgzo.jpg",
    imagePublicId: "categories/h8q4vs6uzkbzqj5rkgzo"
  },
  {
    name: "Fast Food",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766855833/categories/ggn54zoxe5vjtnkavah5.jpg",
    imagePublicId: "categories/ggn54zoxe5vjtnkavah5"
  },
  {
    name: "Dessert",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766824580/categories/j1lizm7o4bnglkzvsfvc.png",
    imagePublicId: "categories/j1lizm7o4bnglkzvsfvc"
  },
  {
    name: "Hot Drinks",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766856283/categories/tmx8veck21jpxgaopz6h.jpg",
    imagePublicId: "categories/tmx8veck21jpxgaopz6h"
  },
  {
    name: "Cold Drinks",
    image: "https://res.cloudinary.com/dzcqne9bn/image/upload/v1766856409/categories/hmh68gclswqzwkzahkps.jpg",
    imagePublicId: "categories/hmh68gclswqzwkzahkps"
  }
];

async function updateCategoryImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    for (const cat of categoryMappings) {
      const updated = await categoryModel.findOneAndUpdate(
        { name: cat.name },
        {
          image: cat.image,
          imagePublicId: cat.imagePublicId
        },
        { new: true, upsert: true }
      );
      console.log(`Updated Category [${cat.name}] => ${cat.image}`);
    }

    console.log("All categories successfully updated with matching images!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating categories:", err);
    process.exit(1);
  }
}

updateCategoryImages();
