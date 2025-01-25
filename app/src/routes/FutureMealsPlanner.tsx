import React, { useState } from "react";
import HomeBar from "../components/HomeBar";
import Footer from "../components/Footer";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function FutureMealsPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Ustawienie daty początkowej
  const [openCalendar, setOpenCalendar] = useState(false);

  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Funkcja zmieniająca datę na kolejny dzień
  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1); // Przejdź do następnego dnia
    setCurrentDate(nextDay);
  };

  // Funkcja zmieniająca datę na poprzedni dzień
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1); // Cofnij do poprzedniego dnia
    setCurrentDate(previousDay);
  };

  // Funkcja do obsługi zmiany daty przez użytkownika z kalendarza
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentDate(newDate);
      setOpenCalendar(false); // Zamknij kalendarz po wyborze daty
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <HomeBar />
      {/* Sekcja z datą */}
      <Box
        sx={{
          position: "absolute",
          top: "80px", // Odstęp od góry (po nagłówku)
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Kontener na datę z oknem o stałej szerokości */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "400px", // Stała szerokość okna
            height: "50px", // Wysokość kontenera
            backgroundColor: "containerDate.light", // Kolor tła, możesz zdefiniować w motywie
            borderRadius: "10px", // Zaokrąglone rogi
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Cień dla okna
            position: "relative", // Aby strzałki były umieszczone względem tego okna
            cursor: "pointer", // Kursor zmienia się na "pointer", aby pokazać, że można kliknąć
          }}
          onClick={() => setOpenCalendar(true)} // Otwórz kalendarz po kliknięciu na datę
        >
          <Typography sx={{ fontSize: "1.2rem" }}>{formattedDate}</Typography>
        </Box>

        {/* Strzałka w lewo - na zewnątrz kontenera */}
        <Button
          onClick={goToPreviousDay}
          sx={{
            position: "absolute",
            left: "calc(50% - 240px)", // Przesunięcie na lewo od kontenera
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "50px",
            fontSize: "2.5rem", // Zwiększenie rozmiaru strzałki
            minWidth: "auto", // Usunięcie minimalnej szerokości przycisku
          }}
        >
          <ArrowLeftIcon fontSize="inherit" />
        </Button>

        {/* Strzałka w prawo - na zewnątrz kontenera */}
        <Button
          onClick={goToNextDay}
          sx={{
            position: "absolute",
            right: "calc(50% - 240px)", // Przesunięcie na prawo od kontenera
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "50px",
            fontSize: "2.5rem", // Zwiększenie rozmiaru strzałki
            minWidth: "auto", // Usunięcie minimalnej szerokości przycisku
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
            onClose={() => setOpenCalendar(false)} // Zamknij kalendarz po kliknięciu poza nim
            sx={{
              position: "absolute", // Ustawienie kalendarza na stałe na ekranie
              top: "calc(80px + 50px)", // Pozycjonowanie kalendarza poniżej okna daty
              left: "50%", // Wyrównanie do środka ekranu w poziomie
              transform: "translateX(-50%)", // Przemieszczenie, aby był dokładnie na środku w poziomie
              zIndex: 1300, // Upewnienie się, że kalendarz będzie nad innymi elementami
            }}
          />
        </LocalizationProvider>
      )}

      <Footer />
    </div>
  );
}

export default FutureMealsPlanner;
