// DailyMealsInfo.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import MealInfo from "./MealInfo";
import { PORT } from "../../PORT";

// Typ posiłku pobranego z backendu
interface MealEntry {
  id: number;
  userID: number;
  date: string; // "YYYY-MM-DD"
  mealName: string; // "Śniadanie" | "Obiad" | "Kolacja"
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  // Możesz dodać inne pola, jeśli są potrzebne
}

interface DailyMealsInfoProps {
  currentDate: Date;
  userID: number;
}

const DailyMealsInfo: React.FC<DailyMealsInfoProps> = ({
  currentDate,
  userID,
}) => {
  const [mealsHistory, setMealsHistory] = useState<MealEntry[]>([]);

  const [caloriesGoal, setCaloriesGoal] = useState<number | null>(null);

  // 🔹 Pobieranie danych użytkownika po załadowaniu strony
  const loadUserCaloriesGoal = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) return;
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (!token) return;

      const response = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userID,
        },
      });
      setCaloriesGoal(Number(response.data.profile.caloriesGoal));
    } catch (error) {
      console.error("Błąd pobierania profilu:", error);
    }
  };

  useEffect(() => {
    loadUserCaloriesGoal();
  }, []);

  // Formatowanie daty do wyświetlenia, np. "środa, 2 lutego 2025"
  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format daty do API: "YYYY-MM-DD"
  const dateParam = currentDate.toISOString().split("T")[0];

  /**
   * Funkcja pobierająca wszystkie posiłki dla danego dnia i użytkownika.
   * Wysyła zapytanie dla każdego posiłku ("Śniadanie", "Obiad", "Kolacja") i scala wyniki.
   */
  const fetchAllMealsForDay = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn(
          "Brak accessToken w localStorage – użytkownik nie jest zalogowany!"
        );
        setMealsHistory([]);
        return;
      }

      const mealNames = ["Śniadanie", "Obiad", "Kolacja"];
      let allMeals: MealEntry[] = [];

      for (const mealName of mealNames) {
        const response = await fetch(
          `http://localhost:${PORT}/api/meals?userID=${userID}&date=${dateParam}&mealName=${encodeURIComponent(
            mealName
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: MealEntry[] = await response.json();
          allMeals = [...allMeals, ...data];
        } else {
          console.error(
            `Błąd pobierania posiłków "${mealName}":`,
            response.statusText
          );
        }
      }

      setMealsHistory(allMeals);
    } catch (error) {
      console.error("Błąd pobierania posiłków z backendu:", error);
    }
  };

  // Pobieranie posiłków przy inicjalnym renderze i przy zmianie userID lub currentDate
  useEffect(() => {
    fetchAllMealsForDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, currentDate]);

  /**
   * Callback wywoływany przez MealInfo po dodaniu/usunięciu posiłku.
   * Służy do odświeżenia danych i pasków.
   */
  const handleMealsUpdated = () => {
    fetchAllMealsForDay();
  };

  // Definicje składników odżywczych i ich zakresów
  const nutrients: Array<keyof MealEntry> = [
    "calories",
    "proteins",
    "carbs",
    "fats",
  ];
  const nutrientLabels = ["Kalorie", "Białko", "Węglowodany", "Tłuszcze"];
  const nutrientRanges: Record<string, { min: number; max: number }> = {
    calories: {
      min: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 1800).toFixed(2))
        : 1800,
      max: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 2200).toFixed(2))
        : 2200,
    },
    proteins: {
      min: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 45).toFixed(2))
        : 45,
      max: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 60).toFixed(2))
        : 60,
    },
    carbs: {
      min: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 225).toFixed(2))
        : 225,
      max: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 300).toFixed(2))
        : 300,
    },
    fats: {
      min: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 60).toFixed(2))
        : 60,
      max: caloriesGoal
        ? parseFloat(((caloriesGoal / 2000) * 80).toFixed(2))
        : 80,
    },
  };

  /**
   * Funkcja obliczająca sumę danego składnika odżywczego.
   */
  const calculateNutrientSum = (nutrient: keyof MealEntry): number => {
    return mealsHistory.reduce((sum, meal) => {
      const value = meal[nutrient];
      return sum + (typeof value === "number" ? value : parseFloat(value));
    }, 0);
  };

  return (
    <Box
      sx={{
        padding: "1vw",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "20px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Plan posiłków na {formattedDate}
      </Typography>

      {/* Kontener na posiłki */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1vw",
        }}
      >
        {["Śniadanie", "Obiad", "Kolacja"].map((mealName) => (
          <MealInfo
            key={mealName}
            currentDate={currentDate}
            mealName={mealName}
            onMealChange={handleMealsUpdated} // Przekazanie callbacka do MealInfo
          />
        ))}
      </Box>

      {/* Kontener na paski składników odżywczych */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1vw",
          marginTop: "20px",
          marginBottom: "94px",
        }}
      >
        {nutrients.map((nutrient, index) => {
          const total = calculateNutrientSum(nutrient);
          const { min, max } = nutrientRanges[nutrient];
          const percentage = Math.min((total / max) * 100, 100); // Maksymalnie 100%
          const rangeStart = (min / max) * 100; // Punkt startowy zakresu

          // Ustalanie koloru paska w zależności od spożycia
          let barColor = "#748844"; // Zielony – w optymalnym zakresie
          if (total < min) {
            barColor = "#f39c12"; // Pomarańczowy – poniżej minimum
          } else if (total > max) {
            barColor = "#e74c3c"; // Czerwony – powyżej maksimum
          }

          return (
            <Box key={nutrient}>
              <Typography variant="body1">{nutrientLabels[index]}</Typography>
              <Box
                sx={{
                  height: "10px",
                  backgroundColor: "#c7d4a9",
                  borderRadius: "5px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Pasek zakresu (min - max) */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${rangeStart}%`,
                    width: `${100 - rangeStart}%`,
                    backgroundColor: "#aec081",
                    zIndex: 1,
                  }}
                />
                {/* Pasek wypełnienia (spożycie) */}
                <Box
                  sx={{
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ display: "block" }}>
                {`Spożyto: ${total.toFixed(2)} ${
                  nutrient === "calories" ? "kcal" : "g"
                } (zakres: ${min} - ${max} ${
                  nutrient === "calories" ? "kcal" : "g"
                })`}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DailyMealsInfo;
