import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Theme,
    SxProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../resources/icon.png"

/**
 * Przykładowy obiekt stylów dla przycisków w nagłówku
 */
const buttonSx: SxProps<Theme> = {
    color: "#fff",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
};


function HomeBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Funkcja sprawdzająca, czy aktualna ścieżka pokrywa się z podaną
     */
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <>
            <AppBar position="sticky">
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "navBar.main", // Zmień kolor według potrzeb
                        px: { xs: 2, sm: 4, md: 6 },
                    }}
                >
                    {/* LOGO (zamiast obrazka można wstawić tekst lub inny element) */}
                    <Box
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img src = {Logo} width={50}/>
                        <Box
                            component="span"
                            sx={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
                        >
                        </Box>
                    </Box>

                    {/* Ikona menu (hamburger) wyświetlana na małych ekranach */}
                    <IconButton
                        edge="end"
                        sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
                        onClick={() => setMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Menu główne - wyświetlane tylko na większych ekranach */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: { xs: 2, md: 3 },
                        }}
                    >
                        <Button
                            sx={{
                                ...buttonSx,
                                fontWeight: isActive("/BMI_calculator") ? "bold" : "normal",
                            }}
                            onClick={() => navigate("/BMI_calculator")}
                        >
                            Kalkulator BMI
                        </Button>
                        <Button
                            sx={{
                                ...buttonSx,
                                fontWeight: isActive("/calorie_calculator")
                                    ? "bold"
                                    : "normal",
                            }}
                            onClick={() => navigate("/calorie_calculator")}
                        >
                            Kalkulator kalorii
                        </Button>
                        <Button
                            sx={{
                                ...buttonSx,
                                fontWeight: isActive("/planner") ? "bold" : "normal",
                            }}
                            onClick={() => navigate("/planner")}
                        >
                            Zaplanuj posiłek
                        </Button>
                    </Box>

                    {/* Przyciski logowania i rejestracji - wyświetlane tylko na większych ekranach */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: { xs: 2, md: 3 },
                        }}
                    >
                        <Button
                            sx={{
                                ...buttonSx,
                                fontWeight: isActive("/login") ? "bold" : "normal",
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Zaloguj
                        </Button>
                        <Button
                            sx={{
                                ...buttonSx,
                                fontWeight: isActive("/register") ? "bold" : "normal",
                            }}
                            onClick={() => navigate("/register")}
                        >
                            Zarejestruj się
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer - boczne menu (na małych ekranach) */}
            <Drawer
                anchor="right"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate("/BMI_calculator");
                                setMenuOpen(false);
                            }}
                        >
                            Kalkulator BMI
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate("/calorie_calculator");
                                setMenuOpen(false);
                            }}
                        >
                            Kalkulator kalorii
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate("/planner");
                                setMenuOpen(false);
                            }}
                        >
                            Zaplanuj posiłek
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate("/login");
                                setMenuOpen(false);
                            }}
                        >
                            Zaloguj
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate("/register");
                                setMenuOpen(false);
                            }}
                        >
                            Zarejestruj się
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

export default HomeBar;
