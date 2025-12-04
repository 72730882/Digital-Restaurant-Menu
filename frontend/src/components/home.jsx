import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

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

  // Filtering by category NAME
  const filteredFoods = selectedCategory
    ? foods.filter(food => food.category?.name === selectedCategory)
    : foods;

  return (
    <div className="home-container">
      <h2 className="title">
        {selectedCategory ? `${selectedCategory} Items` : "Popular Items"}
      </h2>

      {/* 🛑 Show message if no items */}
      {filteredFoods.length === 0 && (
        <p className="no-items-text">
          No items found under <strong>{selectedCategory}</strong> category.
        </p>
      )}

      <div className="cards-grid">
        {filteredFoods.map((item) => (
          <div key={item._id} className="card">
            <img src={item.image} alt={item.name} className="card-img" />
            <h3 className="card-title">{item.name}</h3>
            <p className="card-price">Price : {item.price} ETB</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
