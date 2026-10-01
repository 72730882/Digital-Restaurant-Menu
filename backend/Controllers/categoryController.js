import categoryModel from "../Models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";

// ADD CATEGORY
const addCategory = async (req, res) => {
  try {
    await connectCloudinary();
    const { name, image } = req.body; // image should be Base64 or URL

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    let imageUrl = image;
    let imagePublicId = "";

    // If Base64, upload to Cloudinary
    if (typeof image === "string" && image.startsWith("data:")) {
      const result = await cloudinary.uploader.upload(image, { folder: "categories" });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const category = new categoryModel({
      name: name?.trim(),
      image: imageUrl,
      imagePublicId,
    });

    await category.save();

    res.json({ success: true, message: "Category added successfully", data: category });
  } catch (error) {
    console.error("Add Category Error:", error);
    if (error.code === 11000) {
      return res.json({ success: false, message: "Category already exists" });
    }
    res.json({ success: false, message: error.message || "Error adding category" });
  }
};

// LIST ALL CATEGORIES
const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("List Categories Error:", error);
    res.json({ success: false, message: "Error fetching categories", data: [] });
  }
};

// REMOVE CATEGORY
const removeCategory = async (req, res) => {
  try {
    await connectCloudinary();
    const { id } = req.body;

    if (!id) return res.json({ success: false, message: "Category ID is required" });

    const category = await categoryModel.findById(id);
    if (!category) return res.json({ success: false, message: "Category not found" });

    // Delete image from Cloudinary
    if (category.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(category.imagePublicId);
      } catch (destroyErr) {
        console.warn("Could not delete category image from Cloudinary:", destroyErr);
      }
    }

    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed successfully" });
  } catch (error) {
    console.error("Remove Category Error:", error);
    res.json({ success: false, message: "Error removing category" });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    await connectCloudinary();
    const { id, name, image, imagePublicId } = req.body;

    if (!id) return res.json({ success: false, message: "Category ID is required" });

    let updatedData = { name: name?.trim() };
    let newImageUrl = image;
    let newImagePublicId = imagePublicId;

    // If new image is Base64
    if (image && typeof image === "string" && image.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "categories" });

      // Delete old image if exists
      if (imagePublicId) {
        try {
          await cloudinary.uploader.destroy(imagePublicId);
        } catch (destroyErr) {
          console.warn("Could not delete old category image:", destroyErr);
        }
      }

      newImageUrl = uploadRes.secure_url;
      newImagePublicId = uploadRes.public_id;
    }

    const updated = await categoryModel.findByIdAndUpdate(
      id,
      {
        ...updatedData,
        image: newImageUrl,
        imagePublicId: newImagePublicId,
      },
      { new: true }
    );

    res.json({ success: true, message: "Category updated successfully", data: updated });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.json({ success: false, message: error.message || "Error updating category" });
  }
};

export { addCategory, listCategory, removeCategory, updateCategory };
