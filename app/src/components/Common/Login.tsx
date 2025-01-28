import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    InputAdornment, SxProps, Theme, Box, ListItemButton
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
    const [error, setError] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail("");
        setPassword("");
        setError("");
    };

    const handleLogin = () => {
        if (!email || !password) {
            setError("Wypełnij wszystkie pola!");
            return;
        }
        if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            setError("Niepoprawny email!");
            return;
        }
        alert(`Logowanie: ${email}`);
        handleClose();
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
                    {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
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
        </>
    );
};

export default Login;
