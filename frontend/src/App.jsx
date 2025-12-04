import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import Footer from "./components/Footer";

function App() {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
      <div className="pt-24">
        <Navbar setSelectedCategory={setSelectedCategory} />      
<Home 
  selectedCategory={selectedCategory} 
  clearSelectedCategory={() => setSelectedCategory("")}
/>
        <Footer />
      </div>
    );
}

export default App;
