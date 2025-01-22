import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import icon from "../resources/icon.png"
import Button from "@mui/material/Button";

import "../styles/style.css"

function HomeBar() {
    return (
        <AppBar position="static">
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: 'rgba(152,177,75,0.85)'
            }}>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <img src={icon} alt={"Logo"} height={'60'} style={{padding: 5}}></img>
                </Box>

                <Box sx={{ display: "flex", gap: 4}}>
                    <Button className="homeBarFont">Kalkulator kalorii</Button>
                    <Button className="homeBarFont">Zaplanuj posiłek</Button>
                </Box>

                <Box sx={{ display: "flex", gap: 4 }}>
                    <Typography variant="h6">Dlaczego warto?</Typography>
                    <Typography variant="h6">Zarejestruj się</Typography>
                    <Typography variant="h6">Zaloguj się</Typography>
                </Box>

            </Toolbar>
        </AppBar>
    );
}

export default HomeBar;
