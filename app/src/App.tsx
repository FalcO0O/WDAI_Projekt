import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Products from "./routes/Products";
import MealsHistory from "./routes/MealsHistory";
import FutureMealsPlanner from "./routes/FutureMealsPlanner";
import AdminBrowseRecipies from "./routes/AdminBrowseRecipies";
import BMICalculator from "./routes/BMICalculator";
import CalorieCalculator from "./routes/CalorieCalculator";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<MealsHistory />} />
        <Route path="/planner" element={<FutureMealsPlanner />} />
        <Route path="/calculator" element={<BMICalculator />} />
        <Route path="/recipies/admin/:id" element={<AdminBrowseRecipies />} />
        <Route path="/recipies/user/:id" element={<AdminBrowseRecipies />} />
        <Route path="/BMI_calculator" element={<BMICalculator />} />
        <Route path="/calorie_calculator" element={<CalorieCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
