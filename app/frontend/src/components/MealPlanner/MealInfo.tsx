import React, { useEffect, useState } from "react";
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
import ProductListModal from "./ProductListModal";
import GramsModal from "./GramsModal";
import { PORT } from "../../PORT";

axios.defaults.baseURL = `http://localhost:${PORT}`;

interface MealHistoryEntry {
  id: number;
  userID: number;
  date: string;
  mealName: string;
  productName: string;
  grams: number;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
}

interface MealInfoProps {
  currentDate: Date;
  mealName: string;
  onMealChange?: () => void; // callback do odświeżania w rodzicu
}

const MealInfo: React.FC<MealInfoProps> = ({
  currentDate,
  mealName,
  onMealChange,
}) => {
  // ZAMIAST useState(() => ...), BĘDZIEMY KAŻDORAZOWO ODCZYTYWAĆ userID:
  // const [userID] = useState(() => {...})  -- usuń to

  const [consumedProducts, setConsumedProducts] = useState<MealHistoryEntry[]>(
    []
  );
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [openGramsModal, setOpenGramsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [grams, setGrams] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Format daty "YYYY-MM-DD"
  const formattedDate = currentDate.toISOString().split("T")[0];

  // Pomocnicza funkcja pobierająca dynamicznie userID z localStorage
  const getUserID = (): number => {
    const uid = localStorage.getItem("userID");
    return uid ? Number(uid) : 0;
  };

  // Funkcja wczytująca posiłki TYLKO dla danego mealName
  const fetchMeals = async () => {
    try {
      const userID = getUserID(); // dynamicznie z localStorage
      if (!userID) return; // brak userID = niezalogowany

      const token = localStorage.getItem("accessToken") || "";
      const response = await axios.get("/api/meals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userID,
          date: formattedDate,
          mealName,
        },
      });
      setConsumedProducts(response.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu posiłków:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu produktów:", err);
    }
  };

  // useEffect – wczytaj dane przy zmianie (currentDate, mealName)
  useEffect(() => {
    fetchMeals();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, mealName]);

  // Obsługa modali
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

  // Dodawanie nowego produktu
  const handleSubmitGrams = async () => {
    if (grams === null || grams <= 0) {
      setError("Wartość gramów musi być większa niż 0");
      return;
    }

    const userID = getUserID();
    if (!userID) return;

    const record = {
      userID,
      date: currentDate.toISOString(), // serwer i tak weźmie substring(0,10)
      mealName,
      productName: selectedProduct?.name,
      grams,
      calories: ((grams / 100) * selectedProduct?.calories_per_100g).toFixed(2),
      proteins: ((grams / 100) * selectedProduct?.protein_per_100g).toFixed(2),
      carbs: ((grams / 100) * selectedProduct?.carbs_per_100g).toFixed(2),
      fats: ((grams / 100) * selectedProduct?.fat_per_100g).toFixed(2),
    };

    try {
      const token = localStorage.getItem("accessToken") || "";
      await axios.post("/api/meals", record, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 1) Odśwież w tym komponencie
      handleCloseGramsModal();
      fetchMeals();

      // 2) Powiadom rodzica, by odświeżył paski
      if (onMealChange) {
        onMealChange();
      }
    } catch (error) {
      console.error("Błąd przy zapisie danych:", error);
    }
  };

  // Usuwanie produktu
  const handleRemoveProduct = async (product: MealHistoryEntry) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      await axios.delete(`/api/meals/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 1) Odśwież w tym komponencie
      fetchMeals();

      // 2) Powiadom rodzica
      if (onMealChange) {
        onMealChange();
      }
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
      {/* Nagłówek + przycisk dodawania */}
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
          consumedProducts.map((product) => (
            <ListItem
              key={product.id}
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
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ paddingLeft: 2 }}
          >
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
