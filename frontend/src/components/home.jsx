import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Home = ({ selectedCategory }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pull the base URL from .env with fallback
  const url = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setFoods(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
    if (image.startsWith("data:")) return image;
    if (image.startsWith("http://localhost") || image.startsWith("http://127.0.0.1")) return image;
    if (image.includes("cloudinary.com")) {
      return image.replace(/^http:\/\//i, "https://");
    }
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    const cleanPath = image.startsWith("/") ? image : `/${image}`;
    if (cleanPath.startsWith("/images/")) {
      return `${url}${cleanPath}`;
    }
    return `${url}/images${cleanPath}`;
  };

  const filteredFoods = selectedCategory
    ? foods.filter((food) => {
        if (!food.category) return false;
        if (typeof food.category === "string") {
          return (
            food.category.toLowerCase() === selectedCategory.toLowerCase() ||
            food.category === selectedCategory
          );
        }
        return (
          food.category.name?.toLowerCase() === selectedCategory.toLowerCase() ||
          food.category._id === selectedCategory
        );
      })
    : foods;

  return (
    <div className="home-container">
      <div className="home-bg-decor">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 60, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="decor-circle circle-1" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="decor-circle circle-2" 
        />
        <div className="big-bullets">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} className="bullet b1" />
          <motion.div animate={{ y: [0, -50, 0] }} transition={{ duration: 12, repeat: Infinity }} className="bullet b2" />
          <motion.div animate={{ opacity: [0.03, 0.1, 0.03] }} transition={{ duration: 6, repeat: Infinity }} className="bullet b3" />
        </div>
      </div>

      <motion.h2 
        key={selectedCategory}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="title"
      >
        {selectedCategory ? selectedCategory : "House Specials"}
      </motion.h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
          <p>Loading menu items...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredFoods.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cards-grid">
              {filteredFoods.map((item) => (
                <motion.div key={item._id} className="card" whileHover={{ y: -5 }}>
                  <div className="image-wrapper">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
                      }}
                    />
                    <div className="price-tag">{item.price} ETB</div>
                  </div>
                  <h3 className="card-title">{item.name}</h3>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#777" }}>
              <p>No dishes found in this category.</p>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Home;