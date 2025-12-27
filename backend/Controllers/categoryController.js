import categoryModel from "../Models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";

// ADD CATEGORY
const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body; // image should be Base64

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image, { folder: "categories" });

    const category = new categoryModel({
      name,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    await category.save();

    res.json({ success: true, message: "Category added successfully", data: category });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Category alredy Added" });
  }
};

// LIST ALL CATEGORIES
const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching categories" });
  }
};

// REMOVE CATEGORY
const removeCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.json({ success: false, message: "Category ID is required" });

    const category = await categoryModel.findById(id);
    if (!category) return res.json({ success: false, message: "Category not found" });

    // Delete image from Cloudinary
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing category" });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id, name, image, imagePublicId } = req.body;

    if (!id) return res.json({ success: false, message: "Category ID is required" });

    let updatedData = { name };
    let newImageUrl = image;
    let newImagePublicId = imagePublicId;

    // If new image is Base64
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "categories" });

      // Delete old image if exists
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    }

    await categoryModel.findByIdAndUpdate(id, {
      ...updatedData,
      image: newImageUrl,
      imagePublicId: newImagePublicId,
    });

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating category" });
  }
};

export { addCategory, listCategory, removeCategory, updateCategory };
