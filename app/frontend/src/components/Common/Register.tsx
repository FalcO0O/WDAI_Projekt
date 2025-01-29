import React, { useState } from "react";
import {
    Button,
    TextField,
    IconButton,
    InputAdornment,
    Container,
    Typography,
    Box,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HomeBar from "./HomeBar";
import { PORT } from "../../PORT";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const Register: React.FC = () => {
    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    // Stan dla Snackbarów
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = (): boolean => {
        let newErrors: Errors = {};
        if (!form.firstName) newErrors.firstName = "Imię jest wymagane";
        if (!form.lastName) newErrors.lastName = "Nazwisko jest wymagane";
        if (!form.email) newErrors.email = "Email jest wymagany";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Niepoprawny format email";

        if (!form.password) newErrors.password = "Hasło jest wymagane";
        else if (form.password.length < 6) newErrors.password = "Hasło musi mieć co najmniej 6 znaków";

        if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Hasła muszą być takie same";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`http://localhost:${PORT}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        password: form.password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // np. { message: 'Użytkownik zarejestrowany...' }

                    // Ustawienie sukcesu w Snackbar
                    setSnackbar({ open: true, message: "Rejestracja zakończona sukcesem!", severity: "success" });

                    // Wyczyszczenie formularza
                    setForm({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    });
                } else {
                    const errData = await response.json();
                    setSnackbar({ open: true, message: `Błąd: ${errData.message}`, severity: "error" });
                }
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: "Wystąpił błąd po stronie klienta lub sieci", severity: "error" });
            }
        }
    };

    return (
        <Box sx={{
            backgroundImage: "linear-gradient(325deg, #FFFFFF, #102010)",
            height: '100vh',
            width: "100vw",
        }}>
            <HomeBar/>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Rejestracja
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Imię"
                            name="firstName"
                            fullWidth
                            margin="normal"
                            value={form.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                        <TextField
                            label="Nazwisko"
                            name="lastName"
                            fullWidth
                            margin="normal"
                            value={form.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={form.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Hasło"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={form.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Potwierdź hasło"
                            name="confirmPassword"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                        <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
                            Zarejestruj się
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Snackbar do prezentacji sukcesu lub błędu */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000} // zamknie się po 4 sekundach
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;
