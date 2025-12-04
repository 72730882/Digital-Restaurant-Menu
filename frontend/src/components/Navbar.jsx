import React, { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import allImage from "../assets/all.png";


const Navbar = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category/list")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="explore-menu">
      <h1>Naflet Hotel Digital Menu</h1>

      <div className="explore-menu-list no-scrollbar">

        {/* ⭐ ALL ITEMS BUTTON */}
        <div
          className="explore-menu-list-item"
          onClick={() => setSelectedCategory("")}
          style={{ cursor: "pointer" }}
        >
          <img src={allImage} alt="All" />

          <p>All</p>
        </div>

        {/* ⭐ CATEGORY LIST FROM DATABASE */}
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="explore-menu-list-item"
            onClick={() => setSelectedCategory(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default Navbar;
