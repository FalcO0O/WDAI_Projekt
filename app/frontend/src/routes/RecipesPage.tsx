import React, { useState, useEffect } from "react";
import Footer from "../components/Common/Footer";
import { Box, Typography } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import RecipesList from "../components/Recipes/RecipesList";
function RecipesPage() {
  const [userID, setUserID] = useState<number>(0);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(Number(storedUserID));
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#c7d4a9",
      }}
    >
      <HomeBar />
      <Box sx={{ overflowY: "auto" }}>
        <RecipesList />
        <Footer />
      </Box>
    </Box>
  );
}

export default RecipesPage;
