// src/components/MealPlanner/DailyMealsInfo.tsx
import React from "react";
import MealInfo from "./MealInfo"; // Import komponentu MealInfo
import { Box, Typography } from "@mui/material";

// Typowanie propsów
interface DailyMealsInfoProps {
  currentDate: Date;
}

const DailyMealsInfo: React.FC<DailyMealsInfoProps> = ({ currentDate }) => {
  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const meals = [
    { mealName: "Śniadanie", time: "08:00" },
    { mealName: "Obiad", time: "13:00" },
    { mealName: "Kolacja", time: "18:00" },
  ];

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
          display: "flex", // Flexbox do wyświetlania posiłków obok siebie
          justifyContent: "space-between", // Rozmieszczenie posiłków na całej szerokości
          gap: "1vw", // Odstęp pomiędzy posiłkami
        }}
      >
        {meals.map((meal, index) => (
          <MealInfo
            key={index}
            currentDate={currentDate}
            mealName={meal.mealName}
          />
        ))}
      </Box>
      <Box
        sx={{
          marginTop: "20px",
          marginBottom: "50px",
        }}
      >
        {["Kalorie", "Białko", "Węglowodany", "Tłuszcze"].map(
          (nutrient, index) => (
            <Box key={index} sx={{ marginBottom: "10px" }}>
              <Typography variant="body1">{nutrient}</Typography>
              <Box
                sx={{
                  height: "10px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.random() * 100}%`, // Placeholder for actual nutrient value
                    backgroundColor: "#3f51b5",
                  }}
                />
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default DailyMealsInfo;
