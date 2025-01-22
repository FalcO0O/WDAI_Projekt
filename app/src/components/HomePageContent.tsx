import React from "react";
import { Box, Typography } from "@mui/material";

function HomePageContent() {
    return (
        <Box
            sx={{
                width: { xs: "100%", md: "50%" }, // Responsywna szerokość
                backgroundColor: "rgba(245, 245, 245, 0.9)", // Jasne tło z przezroczystością
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Twój osobisty kalkulator kalorii i planer posiłków!
            </Typography>
            <Typography variant="h6">
                Wygląd strony i jej treść do przegadania, myślę jeszcze czy nie zrobić scrollowalnego homepage
                (cóś takiego: https://www.youtube.com/watch?v=KAG5wNPdoTw)
            </Typography>
        </Box>
    );
}

export default HomePageContent;
