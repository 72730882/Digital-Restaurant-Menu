/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // Fetch all food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/food/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while fetching foods");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while fetching categories");
    }
  };

  // Remove food item
  const removeFood = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/food/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Food removed successfully!");
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove food");
    }
  };

  // Start editing selected food
  const startEdit = (food) => {
    setEditingFood(food);
    setUpdatedData({
      name: food.name,
      category: food.category?._id || "",
      price: food.price,
    });
    setNewImageFile(null);
  };

  // Handle form field changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited food
  const saveEdit = async () => {
  try {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("id", editingFood._id);
    formData.append("name", updatedData.name);
    formData.append("category", updatedData.category);
    formData.append("price", updatedData.price);

    // ONLY append the actual file object if a new one was selected
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    const response = await axios.post(`${backendUrl}/api/food/update`, formData, {
      headers: { 
        token,
        "Content-Type": "multipart/form-data" 
      },
    });

    setIsUploading(false);
    if (response.data.success) {
      toast.success("Food updated successfully!");
      setEditingFood(null);
      setNewImageFile(null);
      fetchList();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    setIsUploading(false);
    console.error(error);
    toast.error("Failed to update food");
  }
};
  useEffect(() => {
    fetchList();
    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <p className="mb-4 text-lg font-bold text-gray-700">All Foods</p>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] bg-gray-100 py-3 px-4 font-semibold border-b text-gray-700">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Price</p>
        <p className="text-center">Actions</p>
      </div>

      {/* Food List */}
      {list.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center border-b py-3 px-4 text-sm md:text-base hover:bg-gray-50"
        >
          <img
            src={newImageFile ? URL.createObjectURL(newImageFile) : item.image}
            alt={item.name}
            className="w-14 h-14 object-cover rounded-md"
          />
          <p>{item.name}</p>
          <p>{item?.category?.name || "N/A"}</p>
          <p>${item.price}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => startEdit(item)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => removeFood(item._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Edit Food: {editingFood.name}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Food Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={updatedData.name}
                  onChange={handleEditChange}
                  placeholder="Enter food name"
                  className="border px-3 py-2 rounded-md"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Category
                </label>
                <select
                  name="category"
                  value={updatedData.category}
                  onChange={handleEditChange}
                  className="border px-3 py-2 rounded-md"
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={updatedData.price}
                  onChange={handleEditChange}
                  placeholder="Enter price"
                  className="border px-3 py-2 rounded-md"
                />
              </div>

              {/* Image preview & upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Image
                </label>

                <img
                  src={
                    newImageFile
                      ? URL.createObjectURL(newImageFile)
                      : editingFood.image
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border mx-auto"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingFood(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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

export default List;
