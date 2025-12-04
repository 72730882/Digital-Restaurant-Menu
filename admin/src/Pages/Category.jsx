/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const CategoryManager = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null
  });
  const [updatedData, setUpdatedData] = useState({
    name: "",
    image: null
  });
  const [isUploading, setIsUploading] = useState(false);

  // Convert image to Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Add new category
  const addCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setIsUploading(true);

      // Convert image to Base64
      const base64Image = await toBase64(formData.image);

      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        {
          name: formData.name.trim(),
          image: base64Image,
        },
        { headers: { token } }
      );

      setIsUploading(false);

      if (response.data.success) {
        toast.success("Category added successfully!");
        setFormData({ name: "", image: null });
        setShowAddForm(false);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Add Category Error:", error);
      toast.error("Error adding category. Make sure your image is not too large.");
    }
  };

  // Remove category
  const removeCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/category/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Category removed successfully!");
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Remove Category Error:", error);
      toast.error("Failed to remove category");
    }
  };

  // Start editing category
  const startEdit = (category) => {
    setEditingCategory(category);
    setUpdatedData({
      name: category.name,
      image: null
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited category
  const saveEdit = async () => {
    if (!updatedData.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setIsUploading(true);

      let imageToSend = editingCategory.image;
      let imagePublicId = editingCategory.imagePublicId;

      // Convert new image to Base64 if selected
      if (updatedData.image) {
        imageToSend = await toBase64(updatedData.image);
      }

      const payload = {
        id: editingCategory._id,
        name: updatedData.name.trim(),
        image: imageToSend,
        imagePublicId: imagePublicId || ""
      };

      const response = await axios.post(
        `${backendUrl}/api/category/update`,
        payload,
        { headers: { token } }
      );

      setIsUploading(false);

      if (response.data.success) {
        toast.success("Category updated successfully!");
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Update Category Error:", error);
      toast.error("Failed to update category");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", image: null });
    setShowAddForm(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-bold text-gray-700">Categories Management</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Add Category
        </button>
      </div>

      {/* Categories List Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr] bg-gray-100 py-4 px-6 font-semibold border-b text-gray-700">
          <p className="text-center">Image</p>
          <p>Name</p>
          <p className="text-center">Actions</p>
        </div>

        {/* Categories List */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="grid grid-cols-[1fr_2fr_1fr] items-center border-b py-4 px-6 text-sm md:text-base hover:bg-gray-50"
            >
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>

              {/* Name */}
              <p className="font-medium text-gray-800">{category.name}</p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => startEdit(category)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeCategory(category._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No categories found. Add your first category!
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
              Add New Category
            </h2>

            <form onSubmit={addCategory} className="space-y-4">
              {/* Image Upload */}
              <div>
                <p className="mb-2 font-semibold">Category Image</p>
                <label
                  htmlFor="category-image"
                  className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50"
                >
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
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
                        Click to upload category image
                      </p>
                    </>
                  )}
                  <input
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    type="file"
                    id="category-image"
                    hidden
                    accept="image/*"
                    required
                  />
                </label>
              </div>

              {/* Category Name */}
              <div>
                <p className="mb-2 font-semibold">Category Name</p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
              Edit Category: {editingCategory.name}
            </h2>

            <div className="space-y-4">
              {/* Image Preview & Upload */}
              <div className="flex flex-col items-center gap-2">
                <p className="font-semibold self-start">Category Image</p>
                <img
                  src={
                    updatedData.image
                      ? URL.createObjectURL(updatedData.image)
                      : editingCategory.image
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdatedData({ ...updatedData, image: e.target.files[0] })}
                  className="text-sm"
                />
              </div>

              {/* Category Name */}
              <div>
                <p className="mb-2 font-semibold">Category Name</p>
                <input
                  type="text"
                  name="name"
                  value={updatedData.name}
                  onChange={handleEditChange}
                  placeholder="Category Name"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;