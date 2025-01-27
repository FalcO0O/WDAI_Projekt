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
          const mianownikMap: { [key: string]: number } = {
            calories: 2000,
            proteins: 50,
            carbs: 275,
            fats: 70,
          };
          const mianownik = mianownikMap[nutrient] || 50;
          const percentage = Math.min((total / mianownik) * 100, 100); // Maksymalnie 100%

          return (
            <Box key={index} sx={{ marginBottom: "10px" }}>
              <Typography variant="body1">{nutrientLabels[index]}</Typography>
              <Box
                sx={{
                  height: "10px",
                  backgroundColor: "#c7d4a9",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: "#748844",
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DailyMealsInfo;
