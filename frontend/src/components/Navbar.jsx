import React, { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import allImage from "../assets/all.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Navbar = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const url = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

  const getOptimizedIcon = (imageUrl) => {
    if (!imageUrl) return allImage;
    if (typeof imageUrl !== "string") return allImage;
    if (imageUrl.includes("cloudinary.com")) {
      return imageUrl.replace(/^http:\/\//i, "https://").replace("/upload/", "/upload/w_200,q_auto,f_auto/");
    }
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
      return imageUrl;
    }
    const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    if (cleanPath.startsWith("/images/")) {
      return `${url}${cleanPath}`;
    }
    return `${url}/images${cleanPath}`;
  };

  useEffect(() => {
    axios
      .get(`${url}/api/category/list`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [url]);

  return (
    <div className="explore-menu">
      {/* Floating Animation for Title */}
      <motion.h1
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        WelCome TO Naflet Hotel
      </motion.h1>

      <div className="explore-menu-list no-scrollbar">
        <div
          className="explore-menu-list-item"
          onClick={() => setSelectedCategory("")}
          style={{ cursor: "pointer" }}
        >
          <img src={allImage} alt="All" />
          <p>All</p>
        </div>

        {categories.map((cat) => (
          <div
            key={cat._id}
            className="explore-menu-list-item"
            onClick={() => setSelectedCategory(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <img 
              src={getOptimizedIcon(cat.image)} 
              alt={cat.name} 
              loading="lazy" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = allImage;
              }}
            />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Navbar;