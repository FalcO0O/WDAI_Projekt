import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import products from "../../MealsDB/products.json";
import ProductListModal from "./ProductListModal";
import GramsModal from "./GramsModal";

axios.defaults.baseURL = "http://localhost:5000";

interface MealInfoProps {
  currentDate: Date;
  mealName: string;
  userID: number;
}

interface MealHistoryEntry {
  userID: number;
  date: string;
  mealName: string;
  productName: string;
  grams: number;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  id: number;
}

const mealHistory: MealHistoryEntry[] = require("../../MealsDB/MealsHistory.json");

const MealInfo: React.FC<MealInfoProps> = ({
  currentDate,
  mealName,
  userID,
}) => {
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [openGramsModal, setOpenGramsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [grams, setGrams] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenProductsModal = () => setOpenProductsModal(true);
  const handleCloseProductsModal = () => setOpenProductsModal(false);

  const handleOpenGramsModal = (product: any) => {
    setSelectedProduct(product);
    setOpenGramsModal(true);
  };
  const handleCloseGramsModal = () => {
    setSelectedProduct(null);
    setGrams(null);
    setOpenGramsModal(false);
    setError(null);
  };

  const handleSubmitGrams = async () => {
    if (grams === null || grams <= 0) {
      setError("Wartość gramów musi być większa niż 0");
      return;
    }

    const record = {
      userID: userID,
      date: currentDate.toISOString(),
      mealName,
      productName: selectedProduct?.name,
      grams,
      calories: ((grams / 100) * selectedProduct?.calories_per_100g).toFixed(2),
      proteins: ((grams / 100) * selectedProduct?.protein_per_100g).toFixed(2),
      carbs: ((grams / 100) * selectedProduct?.carbs_per_100g).toFixed(2),
      fats: ((grams / 100) * selectedProduct?.fat_per_100g).toFixed(2),
    };

    try {
      await axios.post("/api/meals", record);
      handleCloseGramsModal();
    } catch (error) {
      console.error("Błąd przy zapisie danych:", error);
    }
  };

  // Filtracja historii posiłków na podstawie daty i nazwy posiłku
  const formattedDate = currentDate.toISOString().split("T")[0];
  const consumedProducts = mealHistory.filter(
    (entry) =>
      entry.date.startsWith(formattedDate) &&
      entry.mealName === mealName &&
      entry.userID === userID
  );

  // Funkcja do usuwania produktu
  const handleRemoveProduct = async (product: any) => {
    try {
      // Usunięcie rekordu z bazy danych
      await axios.delete(`/api/meals/${product.id}`);

      // Przeładuj listę lub zmodyfikuj stan (np. w przypadku korzystania z lokalnego stanu)
    } catch (error) {
      console.error("Błąd przy usuwaniu produktu:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "32vw",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px",
      }}
    >
      <List>
        <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{mealName}</Typography>
          <IconButton
            edge="end"
            color="success"
            onClick={handleOpenProductsModal}
          >
            <AddIcon />
          </IconButton>
        </ListItem>
      </List>

      {/* Lista spożytych produktów */}
      <List>
        {consumedProducts.length > 0 ? (
          consumedProducts.map((product, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={`${product.productName} (${product.grams} g)`}
                secondary={`Kalorie: ${product.calories} kcal, Białko: ${product.proteins} g, Węglowodany: ${product.carbs} g, Tłuszcze: ${product.fats} g`}
              />
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemoveProduct(product)}
              >
                <RemoveCircleIcon />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Brak spożytych produktów dla tego posiłku
          </Typography>
        )}
      </List>

      {/* Modale */}
      <ProductListModal
        open={openProductsModal}
        onClose={handleCloseProductsModal}
        products={products}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSelectProduct={handleOpenGramsModal}
      />
      <GramsModal
        open={openGramsModal}
        product={selectedProduct}
        grams={grams}
        error={error}
        onClose={handleCloseGramsModal}
        onGramsChange={setGrams}
        onSubmit={handleSubmitGrams}
      />
    </Box>
  );
};

export default MealInfo;
