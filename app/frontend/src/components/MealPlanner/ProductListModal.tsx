import React, { FC } from "react";
import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ProductListModalProps {
  open: boolean;
  onClose: () => void;
  products: any[];
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectProduct: (product: any) => void;
}

const ProductListModal: FC<ProductListModalProps> = ({
  open,
  onClose,
  products,
  searchTerm,
  onSearchChange,
  onSelectProduct,
}) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <TextField
          fullWidth
          placeholder="Wyszukaj produkt..."
          variant="outlined"
          value={searchTerm}
          onChange={onSearchChange}
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
                    onClick={() => onSelectProduct(product)}
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
                        Białko: {product.protein_per_100g} g/100g
                      </Typography>
                      <Typography variant="body2">
                        Tłuszcz: {product.fat_per_100g} g/100g
                      </Typography>
                      <Typography variant="body2">
                        Węglowodany: {product.carbs_per_100g} g/100g
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
  );
};

export default ProductListModal;
