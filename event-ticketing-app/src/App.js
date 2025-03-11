import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import Profile from "./Components/Profile";
import Events from "./Components/Events";
import Categorymanagement from "./Components/CategoryManagement";
import CityManagement from "./Components/CityManagement";
import StudentManagement from "./Components/StudentManagement";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/events" element={<Events />} />
        <Route path="/category-management" element={<Categorymanagement />} />
        <Route path="/City-Management" element={<CityManagement />} />
        <Route path="/Student-Management" element={<StudentManagement />} />
      </Routes>
    </div>
  );
};

export default App;
