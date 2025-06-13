import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import VisualJourney from './pages/VisualJourney'; // adjust path
import About from "./pages/About";

// Create a small component to handle body class based on route
const BodyClassController = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      document.body.classList.add("dashboard-page");
    } else {
      document.body.classList.remove("dashboard-page");
    }
  }, [location]);

  return null; // No UI needed
};

const App = () => {
  return (
    <Router>
      <BodyClassController />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visual-journey" element={<VisualJourney />} /> 
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
