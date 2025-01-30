import { useParams, useNavigate } from "react-router-dom";
import recipesData from "./recipes.json";
import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Paper,
  Divider,
} from "@mui/material";
import HomeBar from "../Common/HomeBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const RecipeDetails: React.FC = () => {
  const { id } = useParams(); // Pobieramy ID przepisu z URL
  const navigate = useNavigate(); // Hook do nawigacji
  const recipe = recipesData.find((r) => r.id === Number(id));

  const [userID, setUserID] = useState<number>(0);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(Number(storedUserID));
    }
  }, []);

  if (!recipe) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 5 }}>
        Przepis nie został znaleziony!
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#c7d4a9",
        position: "relative", // Umożliwia absolutne pozycjonowanie wewnętrznych elementów
      }}
    >
      <HomeBar />

      {/* Przycisk powrotu umieszczony w lewym górnym rogu */}
      <Box
        sx={{
          position: "fixed",
          top: 70,
          zIndex: 1000, // Zapewnia, że przycisk będzie na wierzchu
          display: "flex",
          flexDirection: "column", // Ustawia przyciski jeden pod drugim
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            marginLeft: 2, // Dodanie marginesów 16px (2 * 8px)
            marginY: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {/* {userID !== 0 && (
          <IconButton
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              marginLeft: 2, // Dodanie marginesów 16px (2 * 8px)
              marginY: 1,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        )} */}
      </Box>

      <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
        {/* Główna karta przepisu */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}
            >
              {recipe.name}
            </Typography>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper
              sx={{ padding: 2, borderRadius: 2, backgroundColor: "#eef2e6" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
              >
                Opis:
              </Typography>
              <Typography variant="body1">{recipe.description}</Typography>
            </Paper>

            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Składniki:
              </Typography>
              {recipe.ingredients.map((ing, i) => (
                <Typography key={i} sx={{ marginLeft: 2 }}>
                  - {ing.name}: {ing.grams}g
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
};

export default RecipeDetails;
