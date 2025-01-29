import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import icon from "../resources/icon.png";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import HomeBar from "../Common/HomeBar";

function MealPlannerNavBar() {
  return <HomeBar />;
}

export default MealPlannerNavBar;
