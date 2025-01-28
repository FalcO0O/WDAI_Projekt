import React, { useState } from "react";
import MealPlannerNavBar from "../components/MealPlanner/NavBar";
import Footer from "../components/Common/Footer";
import DateDisplay from "../components/MealPlanner/DateDisplay";
import DailyMealsInfo from "../components/MealPlanner/DailyMealsInfo"; // Importujemy nowy komponent
import { Box } from "@mui/material";

function FutureMealsPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Typowanie stanu na Date
  const username = "test"; // Define username variable

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
          backgroundColor: "#d8e1c3", // Kolor tła
        }}
      >
        <Box
          sx={{
            margin: "20px",
            flex: 1, // Elastyczna przestrzeń dla treści
            overflowY: "auto", // Zapewnienie przewijania, jeśli treści będzie za dużo
          }}
        >
          <DateDisplay
            currentDate={selectedDate}
            onDateChange={handleDateChange}
          />
          <DailyMealsInfo currentDate={selectedDate} username={username} />{" "}
          {/* Dodajemy komponent DailyMealsInfo */}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default FutureMealsPlanner;
