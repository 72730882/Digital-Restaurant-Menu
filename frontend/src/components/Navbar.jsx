import React, { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import allImage from "../assets/all.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Navbar = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  const getOptimizedIcon = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.includes("cloudinary.com")) {
      return imageUrl.replace("/upload/", "/upload/w_200,q_auto,f_auto/");
    }
    return imageUrl;
  };

  useEffect(() => {
    axios
      .get(`${url}/api/category/list`)
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.log(err));
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