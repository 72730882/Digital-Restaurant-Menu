/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import {Routes, Route } from 'react-router-dom'
import Add from "./Pages/Add"
import List from "./Pages/List"
import CategoryManager from "./Pages/Category";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      { token === "" ? <Login setToken={setToken}/> : 
      <>
      <Navbar setToken={setToken} />
      <hr/>
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw, 5px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/add" element={<Add token={token}/>}/>
            <Route path="/list" element={<List token={token} />}/>
            <Route path="/categories" element={<CategoryManager token={token} />}/>
          </Routes>
        </div>
      </div>
      </>
      }
      
    </div>
  );
};

export default App;