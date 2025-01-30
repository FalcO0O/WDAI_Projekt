import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Card,
  CardContent,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom"; // Importujemy Link z react-router-dom

interface Recipe {
  id: number;
  description: string;
  preparation: string;
  grams: number;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  userID: number | null;
}

const RecipesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Wartość wyszukiwania
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]); // Przechowuje przepisy\
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState<string | null>(null); // Ewentualny błąd

  // Funkcja pobierająca przepisy
  const fetchRecipies = async () => {
    try {
      const response = await axios.get("/allRecipes"); // Pobieranie wspólnych przepisów
      setFilteredRecipes(response.data); // Oczekujemy tablicy przepisów
      setLoading(false);
    } catch (error) {
      console.error("Błąd pobierania przepisów:", error);
      setError("Błąd pobierania przepisów.");
      setLoading(false);
    }
  };

  // Pobieranie przepisów przy pierwszym renderowaniu
  useEffect(() => {
    fetchRecipies();
  }, []);

  // Filtruj przepisy według zapytania
  useEffect(() => {
    if (searchQuery) {
      const filtered = filteredRecipes.filter((recipe) =>
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      fetchRecipies(); // Jeśli nie ma zapytania, przywróć wszystkie przepisy
    }
  }, [searchQuery, filteredRecipes]);

  // Wyświetlanie stanu ładowania lub błędu
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 3 }}>
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: 3 }}
          >
            Ładowanie przepisów...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 3 }}>
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: 3 }}
          >
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 3 }}>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginBottom: 3, fontWeight: "bold" }}
        >
          Przepisy
        </Typography>

        <TextField
          label="Wyszukaj przepis"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Zmiana zapytania
          sx={{ marginBottom: 3 }}
        />

        {/* Wyświetlanie wspólnych przepisów */}
        {filteredRecipes.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Brak wyników dla Twojego zapytania.
          </Typography>
        ) : (
          filteredRecipes.map((recipe, index) => {
            return (
              <Card
                key={index}
                sx={{ marginBottom: 3, borderRadius: 2, boxShadow: 1 }}
              >
                <CardContent>
                  <Link
                    to={`/recipe/${recipe.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "inherit" }}
                    >
                      {recipe.description}
                    </Typography>
                  </Link>

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Przygotowanie:
                  </Typography>
                  <Typography>{recipe.preparation}</Typography>

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Wartości odżywcze:
                  </Typography>
                  <Typography>Waga: {recipe.grams} g</Typography>
                  <Typography>Kalorie: {recipe.calories} kcal</Typography>
                  <Typography>Białko: {recipe.proteins} g</Typography>
                  <Typography>Tłuszcze: {recipe.fats} g</Typography>
                  <Typography>Węglowodany: {recipe.carbohydrates} g</Typography>
                </CardContent>
              </Card>
            );
          })
        )}
      </Paper>
    </Container>
  );
};

export default RecipesList;
