import React, { useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Height } from "@mui/icons-material";
// Interfejs dla props komponentu DateDisplay
interface DateDisplayProps {
  currentDate: Date; // Typ dla currentDate, czyli obiekt Date
  onDateChange: (newDate: Date) => void; // Typ dla onDateChange, czyli funkcja przyjmująca Date
}

function DateDisplay({ currentDate, onDateChange }: DateDisplayProps) {
  const [openCalendar, setOpenCalendar] = useState(false);

  // Funkcja formatowania daty
  const formattedDate = currentDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay); // Przekazanie nowej daty do rodzica
  };

  const goToToday = () => {
    const today = new Date();
    onDateChange(today); // Przekazanie obecnej daty do rodzica
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay); // Przekazanie nowej daty do rodzica
  };

  // Kalendarz
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      onDateChange(newDate); // Przekazanie wybranej daty do rodzica
      setOpenCalendar(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "50px",
      }}
    >
      {/* Strzałki nawigacyjne */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",

          zIndex: 2,
        }}
      >
        <IconButton
          onClick={goToToday}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "inherit",
            fontSize: "2.5rem",
            minWidth: "auto",
          }}
        >
          <EventRepeatIcon fontSize="inherit" />
        </IconButton>

        <IconButton
          onClick={() => setOpenCalendar(true)}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "inherit",
            fontSize: "2.5rem",
            minWidth: "auto",
          }}
        >
          <CalendarMonthIcon fontSize="inherit" />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            left: "0px",
            top: "-20px",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "fixed",
            }}
          >
            {openCalendar && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  open={openCalendar}
                  value={currentDate}
                  onChange={handleDateChange}
                  onClose={() => setOpenCalendar(false)}
                  sx={{
                    position: "absolute",
                    left: "0px",
                    zIndex: 1,
                  }}
                />
              </LocalizationProvider>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          minHeight: "50px",
          height: "50px",
        }}
      >
        {/* Strzałki nawigacyjne */}
        <IconButton
          onClick={goToPreviousDay}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "inherit",
            fontSize: "2.5rem",
            minWidth: "auto",
            position: "relative",
            left: "10px",
          }}
        >
          <ArrowLeftIcon fontSize="inherit" />
        </IconButton>

        {/* Okno z datą */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "400px", // Szerokość okna daty
            minHeight: "inherit",
            backgroundColor: "containerDate.light",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
            cursor: "default",
          }}
        >
          <Typography sx={{ fontSize: "1.2rem" }}>{formattedDate}</Typography>
        </Box>

        {/* Strzałki nawigacyjne */}
        <IconButton
          onClick={goToNextDay}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
            height: "inherit",
            fontSize: "2.5rem",
            minWidth: "auto",
            position: "relative",
            right: "10px",
          }}
        >
          <ArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default DateDisplay;
