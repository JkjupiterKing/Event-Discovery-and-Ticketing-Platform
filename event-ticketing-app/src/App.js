import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import Profile from "./Components/Profile";
import Events from "./Components/Events";
import Categorymanagement from "./Components/CategoryManagement";
import StudentManagement from "./Components/StudentManagement";
import StudentHome from "./Components/StudentHome";
import RegisteredEvents from "./Components/RegisteredEvents";
import Reminders from "./Components/Reminders";

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
        <Route path="/Student-Management" element={<StudentManagement />} />
        <Route path="/Student-Home" element={<StudentHome />} />
        <Route path="/RegisterEvents" element={<RegisteredEvents />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </div>
  );
};

export default App;
