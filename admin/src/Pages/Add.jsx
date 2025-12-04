/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // ← NEW
  const [isUploading, setIsUploading] = useState(false);

  // Convert file → Base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // 🔥 Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setIsUploading(true);

      // Convert image to Base64
      const base64Image = await convertToBase64(image);

      // Send to backend
      const response = await axios.post(
        `${backendUrl}/api/food/add`,
        {
          name,
          price,
          category, // category ID
          image: base64Image,
        },
        { headers: { token } }
      );

      setIsUploading(false);

      if (response.data.success) {
        toast.success("Food added successfully!");
        setName("");
        setPrice("");
        setCategory("");
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Add Food Error:", error);
      toast.error("Error adding food");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg gap-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Add New Food Item 🍽️
      </h2>

      {/* Image Upload */}
      <div>
        <p className="mb-2 font-semibold">Upload Image</p>
        <label
          htmlFor="image"
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md"
            />
          ) : (
            <>
              <img
                src={assets.upload_area}
                alt="Upload icon"
                className="w-10 opacity-70"
              />
              <p className="text-sm text-gray-500 mt-2">
                Click to upload food image
              </p>
            </>
          )}
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            accept="image/*"
            required
          />
        </label>
      </div>

      {/* Food Name */}
      <div>
        <p className="mb-2 font-semibold">Food Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Enter food name"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        />
      </div>

      {/* CATEGORY DROPDOWN FROM BACKEND */}
      <div>
        <p className="mb-2 font-semibold">Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <p className="mb-2 font-semibold">Price (ETB)</p>
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          type="number"
          placeholder="Enter price"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading}
        className="mt-4 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition"
      >
        {isUploading ? "Uploading..." : "Add Food"}
      </button>
    </form>
  );
};

export default Add;
