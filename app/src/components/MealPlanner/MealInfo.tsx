// src/components/MealPlanner/MealInfo.tsx
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
import products from "../../MealsDB/products.json"; // Zakładam, że plik products.json znajduje się w katalogu 'data'

// Typowanie propsów
interface MealInfoProps {
  currentDate: Date;
  mealName: string;
}

const MealInfo: React.FC<MealInfoProps> = ({ currentDate, mealName }) => {
  // Stan do kontrolowania otwarcia modalnego okna z listą produktów
  const [openProductsModal, setOpenProductsModal] = useState(false);

  // Stan do kontrolowania otwarcia modalnego okna wprowadzania gramów
  const [openGramsModal, setOpenGramsModal] = useState(false);

  // Stan do obsługi wyszukiwania
  const [searchTerm, setSearchTerm] = useState("");

  // Stan dla wybranego produktu
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Funkcja do otwierania/zamykania modali
  const handleOpenProductsModal = () => setOpenProductsModal(true);
  const handleCloseProductsModal = () => setOpenProductsModal(false);

  const handleOpenGramsModal = (productName: string) => {
    setSelectedProduct(productName);
    setOpenGramsModal(true);
  };
  const handleCloseGramsModal = () => {
    setSelectedProduct(null);
    setOpenGramsModal(false);
  };

  // Obsługa wyszukiwania produktów
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filtruj produkty na podstawie wyszukiwanego terminu
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

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
            Wybierz produkt
          </Typography>

          {/* Pole do wyszukiwania */}
          <TextField
            fullWidth
            placeholder="Wyszukaj produkt..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginBottom: "20px" }}
          />

          {/* Lista przefiltrowanych produktów */}
          <List>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      color="success"
                      onClick={() => handleOpenGramsModal(product.name)}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Kalorie: {product.calories_per_100g} kcal/100g
                        </Typography>
                        <Typography variant="body2">
                          Białko: {product.protein_per_100g}g/100g
                        </Typography>

                        <Typography variant="body2">
                          Węglowodany: {product.carbs_per_100g}g/100g
                        </Typography>
                        <Typography variant="body2">
                          Tłuszcze: {product.fat_per_100g}g/100g
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
            width: "300px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Wprowadź ilość gramów dla {selectedProduct}
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Ilość gramów"
            variant="outlined"
            sx={{ marginBottom: "20px" }}
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
              onClick={handleCloseGramsModal}
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
