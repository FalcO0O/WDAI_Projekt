import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    InputAdornment,
    SxProps,
    Theme,
    Box,
    ListItemButton,
    Snackbar,
    Alert
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { PORT } from "../../PORT";

const buttonSx: SxProps<Theme> = {
    color: "#fff",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
};

const Login = ({ isListItem = false, open, setOpen }: { isListItem?: boolean; open: boolean; setOpen: (value: boolean) => void }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar do pokazywania wiadomości
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail("");
        setPassword("");
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setSnackbar({ open: true, message: "Wypełnij wszystkie pola!", severity: "error" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:${PORT}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Jeżeli ktoś już był zalogowany, usuńmy stare dane z localStorage
                localStorage.removeItem("userID");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRole");


                // Zapisujemy dane nowego użytkownika
                localStorage.setItem("userID", data.userId);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("userRole", data.role);

                // Pokażemy sukces przez Snackbar
                setSnackbar({ open: true, message: "Zalogowano pomyślnie!", severity: "success" });

                setTimeout(() => {
                    handleClose();
                    navigate("/"); // Przekierowanie do strony głównej
                }, 1500);
            } else {
                const errData = await response.json();
                setSnackbar({ open: true, message: errData.message || "Błąd logowania", severity: "error" });
            }
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "Błąd sieci lub serwera", severity: "error" });
        }
    };

    if (isListItem) {
        return (
            <ListItemButton onClick={handleClickOpen} sx={{ textAlign: "left" }}>
                Logowanie
            </ListItemButton>
        );
    }

    return (
        <>
            <Button onClick={handleClickOpen} sx={buttonSx}>
                Logowanie
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Logowanie
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        sx={{ position: "absolute", right: 20, top: 8, overflow: "none" }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Hasło"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between" }}>
                    <Button onClick={() => navigate("/register")} color="secondary">
                        Zarejestruj
                    </Button>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button onClick={handleClose} color="secondary">
                            Anuluj
                        </Button>
                        <Button onClick={handleLogin} color="primary" variant="contained">
                            Zaloguj
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Snackbar do wyświetlania komunikatów */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000} // Zamknie się po 4 sekundach
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Login;
