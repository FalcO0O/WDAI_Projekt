import React, { useState, useEffect } from "react";
import MealPlannerNavBar from "../components/MealPlanner/NavBar";
import Footer from "../components/Common/Footer";
import DateDisplay from "../components/MealPlanner/DateDisplay";
import DailyMealsInfo from "../components/MealPlanner/DailyMealsInfo"; // Importujemy nowy komponent
import { Box } from "@mui/material";

function FutureMealsPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Typowanie stanu na Date
  const userID = 2; // Define userID variable

  // Funkcja aktualizująca datę, parametryzowana jako Date
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate); // Ustawienie nowej daty
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Elementy w kolumnie
        minHeight: "100vh", // Wysokość na całą stronę
          overflowY: "auto", // zatrzymuje homeBar na topie strony
      }}
    >
      <MealPlannerNavBar />
      <Box
        sx={{
          overflowY: "auto", // Zapewnienie przewijania, jeśli treści będzie za dużo
          backgroundColor: "#c7d4a9", // Kolor tła
        }}
      >
        <Box
          sx={{
            marginTop: "15px", // Odległość od góry
            flex: 1, // Elastyczna przestrzeń dla treści
            overflowY: "auto", // Zapewnienie przewijania, jeśli treści będzie za dużo
          }}
        >
          <DateDisplay
            currentDate={selectedDate}
            onDateChange={handleDateChange}
          />
          <DailyMealsInfo currentDate={selectedDate} userID={userID} />{" "}
          {/* Dodajemy komponent DailyMealsInfo */}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default FutureMealsPlanner;
