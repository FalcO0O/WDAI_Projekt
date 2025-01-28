import React, { useState, useEffect } from "react";
import HomeBar from "../components/HomeBar";
import Footer from "../components/Footer";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Definiujemy typ dla postępu i danych produktów
type Progress = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

type Product = {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

function FutureMealsPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });

  const [mealData, setMealData] = useState<any>({
    breakfast: [],
    secondBreakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>({
    name: "",
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });

  // Funkcja formatowania daty
  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Zmieniamy datę
  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setCurrentDate(previousDay);
  };

  // Kalendarz
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentDate(newDate);
      setOpenCalendar(false);
    }
  };

  const setTodayDate = () => {
    setCurrentDate(new Date());
  };

  // Funkcja zapisująca dane w localStorage
  const saveMealData = () => {
    if (currentMeal) {
      const updatedMealData = {
        ...mealData,
        [currentMeal]: [...mealData[currentMeal], product],
      };
      setMealData(updatedMealData);
      localStorage.setItem("mealData", JSON.stringify(updatedMealData)); // Zapisz w localStorage
    }
    setProduct({ name: "", calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
    setOpenDialog(false);
  };

  // Funkcja do obsługi zmiany postępu spożycia
  const handleProgressChange = (nutrient: keyof Progress, value: number) => {
    setProgress((prevState) => ({
      ...prevState,
      [nutrient]: value,
    }));
  };

  // Ładowanie danych z localStorage
  useEffect(() => {
    const savedMealData = localStorage.getItem("mealData");
    if (savedMealData) {
      setMealData(JSON.parse(savedMealData));
    }
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HomeBar />

      {/* Sekcja z datą */}
      <Box
        sx={{
          position: "absolute",
          top: "80px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "400px",
            height: "50px",
            backgroundColor: "containerDate.light",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => setOpenCalendar(true)}
        >
          <Typography sx={{ fontSize: "1.2rem" }}>{formattedDate}</Typography>
        </Box>

        {/* Strzałki nawigacyjne */}
        <Button
          onClick={goToPreviousDay}
          sx={{
            position: "absolute",
            left: "calc(50% - 240px)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "50px",
            fontSize: "2.5rem",
            minWidth: "auto",
          }}
        >
          <ArrowLeftIcon fontSize="inherit" />
        </Button>

        <Button
          onClick={goToNextDay}
          sx={{
            position: "absolute",
            right: "calc(50% - 240px)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "50px",
            fontSize: "2.5rem",
            minWidth: "auto",
          }}
        >
          <ArrowRightIcon fontSize="inherit" />
        </Button>
      </Box>

      {/* Kalendarz */}
      {openCalendar && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            open={openCalendar}
            value={currentDate}
            onChange={handleDateChange}
            onClose={() => setOpenCalendar(false)}
            sx={{
              position: "absolute",
              top: "calc(80px + 50px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1300,
            }}
          />
        </LocalizationProvider>
      )}

      {/* Paski postępu */}
      <Box
        sx={{
          position: "absolute",
          top: "calc(80px + 50px)",
          left: "10px",
          right: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography variant="h6">Kalorie</Typography>
        <LinearProgress
          variant="determinate"
          value={progress.calories}
          sx={{
            width: "100%",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-barColorPrimary": {
              backgroundColor: "#76c7c0",
            },
          }}
        />

        {["protein", "carbohydrates", "fat"].map((nutrient) => (
          <Box key={nutrient}>
            <Typography variant="h6" sx={{ marginBottom: "5px" }}>
              {nutrient === "protein"
                ? "Białko"
                : nutrient === "carbohydrates"
                ? "Węglowodany"
                : "Tłuszcze"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress[nutrient as keyof Progress]}
              sx={{
                width: "100%",
                height: "10px",
                borderRadius: "5px",
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-barColorPrimary": {
                  backgroundColor: "#76c7c0",
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Panel posiłków obok siebie */}
      <Box
        sx={{
          position: "absolute",
          top: "calc(400px)",
          left: "10px",
          right: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {["breakfast", "secondBreakfast", "lunch", "snack", "dinner"].map(
          (meal) => (
            <Box
              key={meal}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "1 1 18%",
                minWidth: "150px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography sx={{ fontSize: "1.1rem", marginBottom: "5px" }}>
                {meal === "breakfast"
                  ? "Śniadanie"
                  : meal === "secondBreakfast"
                  ? "Drugie Śniadanie"
                  : meal === "lunch"
                  ? "Obiad"
                  : meal === "snack"
                  ? "Podwieczorek"
                  : "Kolacja"}
              </Typography>
              {mealData[meal].map((product: Product, index: number) => (
                <Box key={index}>
                  <Typography variant="body2">{product.name}</Typography>
                  <Typography variant="body2">
                    Kalorie: {product.calories}
                  </Typography>
                  <Typography variant="body2">
                    Białko: {product.protein}g
                  </Typography>
                  <Typography variant="body2">
                    Węglowodany: {product.carbohydrates}g
                  </Typography>
                  <Typography variant="body2">
                    Tłuszcze: {product.fat}g
                  </Typography>
                </Box>
              ))}
              <AddIcon
                sx={{
                  cursor: "pointer",
                  color: "#4caf50",
                  fontSize: "1.8rem",
                }}
                onClick={() => {
                  setCurrentMeal(meal);
                  setOpenDialog(true);
                }}
              />
            </Box>
          )
        )}
      </Box>

      {/* Formularz dodawania produktu */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Dodaj produkt do posiłku</DialogTitle>
        <DialogContent>
          <TextField
            label="Nazwa produktu"
            fullWidth
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <TextField
            label="Kalorie"
            fullWidth
            value={product.calories}
            onChange={(e) =>
              setProduct({ ...product, calories: +e.target.value })
            }
            type="number"
          />
          <TextField
            label="Białko"
            fullWidth
            value={product.protein}
            onChange={(e) =>
              setProduct({ ...product, protein: +e.target.value })
            }
            type="number"
          />
          <TextField
            label="Węglowodany"
            fullWidth
            value={product.carbohydrates}
            onChange={(e) =>
              setProduct({ ...product, carbohydrates: +e.target.value })
            }
            type="number"
          />
          <TextField
            label="Tłuszcze"
            fullWidth
            value={product.fat}
            onChange={(e) => setProduct({ ...product, fat: +e.target.value })}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Anuluj
          </Button>
          <Button onClick={saveMealData} color="primary">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}

export default FutureMealsPlanner;
