import React, { useState } from "react";
import { Box, TextField, Button, Typography, Toolbar } from "@mui/material";
import axios, { AxiosError } from "axios"; // Importujemy AxiosError
import HomeBar from "../components/HomeBar";

// Definiowanie interfejsu dla danych błędu
interface ErrorResponse {
  error: string; // Zakładamy, że błąd będzie w polu 'error'
}

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });

      setMessage(response.data.message);
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      // Rzutowanie błędu na AxiosError
      const axiosError = err as AxiosError<ErrorResponse>; // Używamy naszego interfejsu ErrorResponse
      setError(
        axiosError.response?.data?.error ||
          "Błąd rejestracji. Spróbuj ponownie."
      );
      setMessage("");
    }
  };

  return (
    <Box>
      <HomeBar />
      <Toolbar /> {/* Dodanie Toolbar, aby dodać przestrzeń pod HomeBar */}
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
      >
        <Typography variant="h4" gutterBottom>
          Zarejestruj się
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Hasło"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Zarejestruj się
        </Button>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
        {message && (
          <Typography color="primary" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RegisterPage;
