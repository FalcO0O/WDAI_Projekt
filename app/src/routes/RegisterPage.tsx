import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import RegisterForm from "../components/RegisterForm";
import MessageDisplay from "../components/MessageDisplay";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  return (
    <Box>
      <HomeBar />
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: "#d8e1c3", // Tło strony
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            maxWidth: 450,
            width: "100%",
            backgroundColor: "#f4f4f4",
            padding: "40px",
            borderRadius: "8px", // Zaokrąglone rogi
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)", // Cień
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "fixed",
            marginTop: "20px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#333", // Kolor nagłówka
              fontWeight: "600", // Pogrubienie nagłówka
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Rejestracja
          </Typography>

          {/* Formularz */}
          <RegisterForm setMessage={setMessage} setError={setError} />

          {/* Wyświetlanie błędów i komunikatów */}
          <MessageDisplay error={error} message={message} />
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterPage;
