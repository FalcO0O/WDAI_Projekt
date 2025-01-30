import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import HomeBar from "../components/Common/HomeBar";
import Footer from "../components/Common/Footer";
import CalorieCalculatorContent from "../components/CalorieCalculator/CalorieCalculatorContent";
import bgImage from "../resources/calorie-background.jpg";
import axios from "axios";

function CalorieCalculator() {
  const [user, setUser] = useState(null);
  const [caloriesGoal, setCaloriesGoal] = useState("");
  const [newCaloriesGoal, setNewCaloriesGoal] = useState("");

  // 🔹 Pobieranie danych użytkownika po załadowaniu strony
  const fetchUser = async () => {
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

      setUser(response.data.profile);
      setCaloriesGoal(response.data.profile.caloriesGoal);
    } catch (error) {
      console.error("Błąd pobierania profilu:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Obsługa zapisu celu kalorycznego
  const handleSaveGoal = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      await axios.put(
        "api/users/calories-goal",
        { caloriesGoal: newCaloriesGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCaloriesGoal(newCaloriesGoal); // Aktualizacja wartości w stanie
      setNewCaloriesGoal("");
      alert("Cel kaloryczny został zapisany!");
    } catch (error) {
      console.error("Błąd zapisu celu:", error);
      alert("Wystąpił błąd podczas zapisywania celu.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <HomeBar />
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          minHeight: "calc(100vh)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            width: "90%",
            maxWidth: "600px",
            padding: 3,
            boxShadow: 3,
            marginTop: "30px",
            marginBottom: "80px",
          }}
        >
          <CalorieCalculatorContent />

          {/* 🔹 Sekcja zapisu celu kalorycznego dla zalogowanych użytkowników */}
          {user ? (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="h6">
                Twój cel kaloryczny: {caloriesGoal} kcal
              </Typography>
              <TextField
                label="Nowy cel kaloryczny"
                type="number"
                value={newCaloriesGoal}
                onChange={(e) => setNewCaloriesGoal(e.target.value)}
                sx={{ mt: 2, width: "100%" }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSaveGoal}
                disabled={!newCaloriesGoal}
              >
                Zapisz cel
              </Button>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
              Zaloguj się, aby ustawić cel kaloryczny.
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default CalorieCalculator;
