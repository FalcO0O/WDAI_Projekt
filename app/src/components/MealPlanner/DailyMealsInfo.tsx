import React, { useState, useEffect } from "react";
import MealInfo from "./MealInfo";
import { Box, Typography } from "@mui/material";
import MealsHistoryData from "../../MealsDB/MealsHistory.json"; // Import danych z JSON

interface DailyMealsInfoProps {
  currentDate: Date;
  userID: number;
}

// Funkcja pomocnicza do obliczania sumy składnika
const calculateNutrientSum = (
  mealsHistory: any[],
  nutrient: string,
  userID: number,
  date: string
) => {
  return mealsHistory
    .filter(
      (meal) =>
        meal.userID === userID &&
        new Date(meal.date).toLocaleDateString("pl-PL") === date
    )
    .reduce((sum, meal) => sum + parseFloat(meal[nutrient] || "0"), 0);
};

const DailyMealsInfo: React.FC<DailyMealsInfoProps> = ({
  currentDate,
  userID,
}) => {
  const [mealsHistory, setMealsHistory] = useState<any[]>([]);

  // Formatowanie daty
  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    // Załaduj dane (dla symulacji załadunku JSON można to zastąpić fetch, jeśli dane są z serwera)
    setMealsHistory(MealsHistoryData);
  }, []);

  // Obliczanie sum dla składników
  const nutrients = ["calories", "proteins", "carbs", "fats"];
  const nutrientLabels = ["Kalorie", "Białko", "Węglowodany", "Tłuszcze"];
  const nutrientRanges: { [key: string]: { min: number; max: number } } = {
    calories: { min: 1800, max: 2200 },
    proteins: { min: 45, max: 60 },
    carbs: { min: 225, max: 300 },
    fats: { min: 60, max: 80 },
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

      {/* Kontener flex na posiłki */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1vw",
        }}
      >
        {["Śniadanie", "Obiad", "Kolacja"].map((mealName, index) => (
          <MealInfo
            key={index}
            currentDate={currentDate}
            mealName={mealName}
            userID={userID}
          />
        ))}
      </Box>

      {/* Kontener flex na paski */}
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
          const total = calculateNutrientSum(
            mealsHistory,
            nutrient,
            userID,
            currentDate.toLocaleDateString("pl-PL")
          );
          const range = nutrientRanges[nutrient];
          const percentage = Math.min((total / range.max) * 100, 100); // Maksymalnie 100%
          const rangeStart = Math.max((range.min / range.max) * 100, 0); // Początek zakresu w %
          const rangeEnd = Math.min((range.max / range.max) * 100, 100); // Koniec zakresu w %

          // Ustal kolor paska w zależności od zakresu
          let barColor = "#748844"; // Domyślny kolor (w optymalnym zakresie)
          if (total < range.min) {
            barColor = "#f39c12"; // Pomarańczowy (poniżej minimum)
          } else if (total > range.max) {
            barColor = "#e74c3c"; // Czerwony (powyżej maksimum)
          }

          return (
            <Box key={index} sx={{ marginBottom: "10px" }}>
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
                {/* Pasek zakresu */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${rangeStart}%`,
                    width: `${rangeEnd - rangeStart}%`,
                    backgroundColor: "#aec081", // Jasnozielony dla zakresu
                    zIndex: 1,
                  }}
                />
                {/* Pasek wypełnienia */}
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
                } (zakres: ${range.min} - ${range.max} ${
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
