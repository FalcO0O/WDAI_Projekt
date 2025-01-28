import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import icon from "../resources/icon.png";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import { buttonStyle } from "../styles/style";

function HomeBar() {
    const navigate = useNavigate();

    return (
        <AppBar position="sticky">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "navBar.main",
                    flexWrap: "wrap", // Zapewnia przenoszenie elementów na nową linię
                    paddingX: { xs: 1, sm: 2 }, // Mniejsze paddingi na wąskich ekranach
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <img
                        src={icon}
                        alt="Logo"
                        height="50" // Zmniejszenie wysokości na małych ekranach
                        style={{ padding: 5, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </Box>

                {/* Przyciski nawigacyjne */}
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" }, // Ukrycie przycisków na bardzo małych ekranach
                        gap: { xs: 2, sm: 4 },
                        flexWrap: "wrap", // Zapobiega rozjeżdżaniu na małych ekranach
                    }}
                >
                    <Button sx={buttonStyle} onClick={() => navigate('/BMI_calculator')}>Kalkulator BMI</Button>
                    <Button sx={buttonStyle} onClick={() => navigate('/calorie_calculator')}>Kalkulator kalorii</Button>
                    <Button sx={buttonStyle} onClick={() => navigate('/planner')}>Zaplanuj posiłek</Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: { xs: 2, sm: 4 },
                        flexWrap: "wrap",
                    }}
                >
                    <Button sx={buttonStyle}>Zaloguj</Button>
                    <Button sx={buttonStyle}>Zarejestruj się</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default HomeBar;
