import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios"; // Do komunikacji z backendem
import products from "../../MealsDB/products.json"; // Plik z produktami

// Ustawienie bazowego URL
axios.defaults.baseURL = "http://localhost:5000"; // Zmień na odpowiedni URL backendu

interface MealInfoProps {
  currentDate: Date;
  mealName: string;
}

const MealInfo: React.FC<MealInfoProps> = ({ currentDate, mealName }) => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  const handleSubmitGrams = async () => {
    if (grams === null || grams <= 0) {
      setError("Wartość gramów musi być większa niż 0");
      return;
    }

    if (selectedProduct && grams) {
      const calories = (grams / 100) * selectedProduct.calories_per_100g;
      const proteins = (grams / 100) * selectedProduct.protein_per_100g;
      const carbs = (grams / 100) * selectedProduct.carbs_per_100g;
      const fats = (grams / 100) * selectedProduct.fat_per_100g;

      const record = {
        userID: 1,
        date: currentDate.toISOString(),
        mealName,
        productName: selectedProduct.name,
        grams,
        calories: calories.toFixed(2),
        proteins: proteins.toFixed(2),
        carbs: carbs.toFixed(2),
        fats: fats.toFixed(2),
      };

      try {
        const response = await axios.post("/api/meals", record);
        console.log(response.data.message);
        handleCloseGramsModal();
      } catch (error) {
        console.error("Błąd przy zapisie danych:", error);
      }
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          {mealName}
        </Typography>
        <IconButton color="success" onClick={handleOpenProductsModal}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Modal z listą produktów */}
      <Modal
        open={openProductsModal}
        onClose={handleCloseProductsModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            maxHeight: "80vh",
            overflowY: "auto",
            width: "400px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Dodaj produkt do
            {mealName === "Śniadanie"
              ? " śniadania"
              : mealName === "Obiad"
              ? " obiadu"
              : mealName === "Kolacja"
              ? " kolacji"
              : mealName}
          </Typography>
          <TextField
            fullWidth
            placeholder="Wyszukaj produkt..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginBottom: "20px" }}
          />
          <List>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      color="success"
                      onClick={() => handleOpenGramsModal(product)}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <>
                        <Typography>
                          Kalorie: {product.calories_per_100g} kcal/100g
                        </Typography>
                        <Typography>
                          Białko: {product.protein_per_100g} g/100g
                        </Typography>
                        <Typography>
                          Węglowodany: {product.carbs_per_100g} g/100g
                        </Typography>
                        <Typography>
                          Tłuszcze: {product.fat_per_100g} g/100g
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Brak wyników
              </Typography>
            )}
          </List>
        </Box>
      </Modal>

      {/* Modal wprowadzania gramów */}
      <Modal
        open={openGramsModal}
        onClose={handleCloseGramsModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            width: "auto",
          }}
        >
          <ListItemText
            primary={
              <>
                <Typography variant="h6">Wprowadź ilość gramów dla:</Typography>
                <Typography variant="h6">{selectedProduct?.name}</Typography>
              </>
            }
            secondary={
              <>
                <Typography>
                  Kalorie: {selectedProduct?.calories_per_100g} kcal/100g
                </Typography>
                <Typography>
                  Białko: {selectedProduct?.protein_per_100g} g/100g
                </Typography>
                <Typography>
                  Węglowodany: {selectedProduct?.carbs_per_100g} g/100g
                </Typography>
                <Typography>
                  Tłuszcze: {selectedProduct?.fat_per_100g} g/100g
                </Typography>
              </>
            }
          />
          <TextField
            fullWidth
            type="number"
            placeholder="Ilość gramów"
            variant="outlined"
            value={grams || ""}
            onChange={(e) => setGrams(Number(e.target.value))}
            sx={{ marginBottom: "20px" }}
            error={!!error}
            helperText={error}
          />
          <Box display="flex" justifyContent="flex-end" gap="10px">
            <Button
              onClick={handleCloseGramsModal}
              color="error"
              variant="outlined"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleSubmitGrams}
              color="primary"
              variant="contained"
            >
              Zatwierdź
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MealInfo;
