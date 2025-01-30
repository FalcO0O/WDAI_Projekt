import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Card,
  CardContent,
  Container,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom"; // Importujemy Link z react-router-dom
import recipesData from "./recipes.json";

interface Ingredient {
  name: string;
  grams: number;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
}

interface Recipe {
  id: number; // Dodajemy id przepisu
  name: string;
  ingredients: Ingredient[];
  description: string;
}

const RecipesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setFilteredRecipes(
      recipesData.filter((recipe: Recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

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
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        {filteredRecipes.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Brak wyników dla Twojego zapytania.
          </Typography>
        ) : (
          filteredRecipes.map((recipe, index) => {
            const total = recipe.ingredients.reduce(
              (acc, ing) => {
                acc.calories += ing.calories;
                acc.proteins += ing.proteins;
                acc.fats += ing.fats;
                acc.carbohydrates += ing.carbohydrates;
                return acc;
              },
              { calories: 0, proteins: 0, fats: 0, carbohydrates: 0 }
            );

            return (
              <Card
                key={index}
                sx={{ marginBottom: 3, borderRadius: 2, boxShadow: 1 }}
              >
                <CardContent>
                  {/* Link do szczegółów przepisu bez podświetlania */}
                  <Link
                    to={`/recipe/${recipe.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "inherit" }}
                    >
                      {recipe.name}
                    </Typography>
                  </Link>

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Składniki:
                  </Typography>
                  {recipe.ingredients.map((ing, i) => (
                    <Typography key={i} sx={{ marginLeft: 2 }}>
                      - {ing.name}: {ing.grams.toFixed(2)}g
                    </Typography>
                  ))}

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Wartości odżywcze:
                  </Typography>
                  <Typography>
                    Kalorie: {total.calories.toFixed(2)} kcal
                  </Typography>
                  <Typography>Białko: {total.proteins.toFixed(2)} g</Typography>
                  <Typography>Tłuszcze: {total.fats.toFixed(2)} g</Typography>
                  <Typography>
                    Węglowodany: {total.carbohydrates.toFixed(2)} g
                  </Typography>
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
