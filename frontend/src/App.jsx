import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import Footer from "./components/Footer";

function App() {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
      /* THE SAFE WRAPPER: 
         We add hard-coded white background and dark text here.
         'minHeight: 100vh' ensures the white covers the whole screen.
      */
      <div 
        className="pt-24" 
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#262626', 
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar setSelectedCategory={setSelectedCategory} />      
        
        {/* Main Content Area */}
        <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Home 
            selectedCategory={selectedCategory} 
            clearSelectedCategory={() => setSelectedCategory("")}
          />
        </div>

        <Footer />
      </div>
    );
}

export default App;