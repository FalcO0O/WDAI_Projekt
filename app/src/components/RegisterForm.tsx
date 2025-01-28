import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";

// Definiowanie interfejsu dla danych błędu
interface ErrorResponse {
  error: string;
}

interface RegisterFormProps {
  setMessage: (message: string) => void;
  setError: (error: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  setMessage,
  setError,
}) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // Stan dla nazwy użytkownika
  const [password, setPassword] = useState<string>(""); // Hasło domyślnie puste
  const [isAgreed, setIsAgreed] = useState<boolean>(false); // Stan dla checkboxa
  const [openTerms, setOpenTerms] = useState<boolean>(false); // Stan do regulaminu
  const [openPrivacy, setOpenPrivacy] = useState<boolean>(false); // Stan do polityki prywatności

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedUsername = sessionStorage.getItem("username");

    if (storedEmail) setEmail(storedEmail);
    if (storedUsername) setUsername(storedUsername);

    setPassword(""); // Resetujemy hasło, aby nie było zapisane
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAgreed) {
      setError("Musisz zaakceptować regulamin i politykę prywatności.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email,
        username, // Przekazujemy nazwę użytkownika
        password,
      });

      setMessage(response.data.message);
      setEmail("");
      setUsername("");
      setPassword("");
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data.error || "Błąd rejestracji. Spróbuj ponownie."
      );
      setMessage("");
    }
  };

  const handleClose = () => {
    setOpenTerms(false);
    setOpenPrivacy(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    >
      <TextField
        label="Nazwa użytkownika"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          sessionStorage.setItem("username", e.target.value); // Zapamiętanie nazwy użytkownika
        }}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          sessionStorage.setItem("email", e.target.value); // Zapamiętanie emaila
        }}
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
      <FormControlLabel
        control={
          <Checkbox
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            sx={{
              color: "#47542a",
              "&.Mui-checked": {
                color: "#47542a",
              },
            }}
          />
        }
        label={
          <span>
            Akceptuję{" "}
            <Link
              href="#"
              onClick={() => setOpenTerms(true)}
              sx={{ color: "#47542a", fontWeight: "bold" }}
            >
              regulamin
            </Link>{" "}
            oraz{" "}
            <Link
              href="#"
              onClick={() => setOpenPrivacy(true)}
              sx={{ color: "#47542a", fontWeight: "bold" }}
            >
              politykę prywatności
            </Link>
          </span>
        }
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Zarejestruj się
      </Button>

      <Dialog open={openTerms} onClose={handleClose}>
        <DialogTitle>Regulamin</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tutaj wpisz treść regulaminu. Możesz dodać pełną treść regulaminu,
            aby użytkownik mógł go przeczytać.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPrivacy} onClose={handleClose}>
        <DialogTitle>Polityka prywatności</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tutaj wpisz treść polityki prywatności. Możesz dodać pełną treść
            polityki prywatności, aby użytkownik mógł ją przeczytać.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterForm;
