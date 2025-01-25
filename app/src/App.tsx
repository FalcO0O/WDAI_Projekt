import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Products from "./routes/Products";
import MealsHistory from "./routes/MealsHistory";
import FutureMealsPlanner from "./routes/FutureMealsPlanner";
import Calculator from "./routes/Calculator";
import AdminBrowseRecipies from "./routes/AdminBrowseRecipies";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<MealsHistory />} />
        <Route path="/planner" element={<FutureMealsPlanner />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/recipies/admin/:id" element={<AdminBrowseRecipies />} />
        <Route path="/recipies/user/:id" element={<AdminBrowseRecipies />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </Router>
  );
}

export default App;
