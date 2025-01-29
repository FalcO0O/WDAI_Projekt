import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Card,
  CardContent,
  Container,
  Paper,
  Tooltip, // Importujemy Tooltip z MUI
} from "@mui/material";
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
  name: string;
  ingredients: Ingredient[];
  description: string; // Zmienna 'description' do przechowywania opisu przepisu
}

const RecipesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setFilteredRecipes(
      recipesData.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  return (
    <Container
      maxWidth="lg" // Zmieniamy na "lg" dla szerszego komponentu
      sx={{ marginTop: 5, marginBottom: 3 }} // Dodajemy margines na dole
    >
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
                  {/* Tooltip na nazwie przepisu */}
                  <Tooltip
                    title={recipe.description}
                    arrow
                    placement="bottom" // Ustawiamy pozycję tooltipa na dole
                    sx={{
                      fontSize: "16px", // Ustalamy większy rozmiar czcionki
                      maxWidth: "300px", // Maksymalna szerokość tooltipa
                      backgroundColor: "rgba(0, 0, 0, 0.87)", // Tło tooltipa
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", cursor: "pointer" }}
                    >
                      {recipe.name}
                    </Typography>
                  </Tooltip>

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Składniki:
                  </Typography>
                  {recipe.ingredients.map((ing, i) => (
                    <Typography key={i} sx={{ marginLeft: 2 }}>
                      - {ing.name}: {ing.grams}g
                    </Typography>
                  ))}

                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Wartości odżywcze:
                  </Typography>
                  <Typography>Kalorie: {total.calories} kcal</Typography>
                  <Typography>Białko: {total.proteins} g</Typography>
                  <Typography>Tłuszcze: {total.fats} g</Typography>
                  <Typography>Węglowodany: {total.carbohydrates} g</Typography>
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
