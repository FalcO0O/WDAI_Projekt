import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Products from "./routes/Products";
import MealsHistory from "./routes/MealsHistory";
import FutureMealsPlanner from "./routes/FutureMealsPlanner";
import BMICalculator from "./routes/BMICalculator";
import CalorieCalculator from "./routes/CalorieCalculator";
import Register from "./components/Common/Register";
import RecipesPage from "./routes/RecipesPage";
import RecipeDetails from "./components/Recipes/RecipeDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<MealsHistory />} />
        <Route path="/planner" element={<FutureMealsPlanner />} />
        <Route path="/calculator" element={<BMICalculator />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/BMI_calculator" element={<BMICalculator />} />
        <Route path="/calorie_calculator" element={<CalorieCalculator />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
