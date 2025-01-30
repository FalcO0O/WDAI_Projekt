import React, { useState, useEffect } from "react";
import Footer from "../components/Common/Footer";
import { Box, IconButton } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import RecipesList from "../components/Recipes/RecipesList";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import zielonego plusa

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
        position: "relative", // Potrzebne dla absolutnego pozycjonowania ikony
      }}
    >
      <HomeBar />

      {/* {userID !== 0 && (
        <Box
          sx={{
            position: "fixed",
            top: 60,
            zIndex: 1000, // Zapewnia, że przycisk będzie na wierzchu
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              margin: 2, // Dodanie marginesów 16px (2 * 8px)
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Box>
      )} */}

      <Box sx={{ overflowY: "auto" }}>
        <RecipesList />
        <Footer />
      </Box>
    </Box>
  );
}

export default RecipesPage;
