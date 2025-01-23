import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import icon from "../resources/icon.png";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import { buttonStyle } from "../styles/style";

function HomeBar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "navBar.main",
                }}
            >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <img
                        src={icon}
                        alt="Logo"
                        height="60"
                        style={{ padding: 5, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 4 }}>
                    <Button sx={ buttonStyle } onClick={() => navigate('calculator')}>Kalkulator kalorii</Button>
                    <Button sx={ buttonStyle } onClick={() => navigate('planner')}>Zaplanuj posiłek</Button>
                </Box>

                <Box sx={{ display: "flex", gap: 4 }}>
                    <Button sx={ buttonStyle }>Zaloguj</Button>
                    <Button sx={ buttonStyle }>Zarejestruj się</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default HomeBar;
