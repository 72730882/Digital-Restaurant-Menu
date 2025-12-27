import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Home = ({ selectedCategory }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food/list");
      if (res.data.success) {
        setFoods(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching foods:", error);
    }
  };

  const filteredFoods = selectedCategory
    ? foods.filter(food => food.category?.name === selectedCategory)
    : foods;

  return (
    <div className="home-container">
      {/* --- MOVABLE BACKGROUND DECOR --- */}
      <div className="home-bg-decor">
        {/* Circle 1: Drifts and Rotates */}
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 60, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="decor-circle circle-1" 
        />
        
        {/* Circle 2: Drifts in opposite direction */}
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="decor-circle circle-2" 
        />

        <div className="big-bullets">
          {/* Bullet 1: Pulsates scale */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 8, repeat: Infinity }} 
            className="bullet b1" 
          />
          {/* Bullet 2: Moves up and down */}
          <motion.div 
            animate={{ y: [0, -50, 0] }} 
            transition={{ duration: 12, repeat: Infinity }} 
            className="bullet b2" 
          />
          {/* Bullet 3: Fades in and out */}
          <motion.div 
            animate={{ opacity: [0.03, 0.1, 0.03] }} 
            transition={{ duration: 6, repeat: Infinity }} 
            className="bullet b3" 
          />
        </div>
      </div>

      {/* Title with entrance effect */}
      <motion.h2 
        key={selectedCategory}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="title"
      >
        {selectedCategory ? selectedCategory : "House Specials"}
      </motion.h2>

      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cards-grid"
        >
          {filteredFoods.map((item) => (
            <motion.div 
              key={item._id} 
              className="card"
              whileHover={{ y: -5 }}
            >
              <div className="image-wrapper">
                <img src={item.image} alt={item.name} className="card-img" />
                <div className="price-tag">{item.price} ETB</div>
              </div>
              <h3 className="card-title">{item.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;