// SectionOne.js
import React from "react";
import { Typography, Box } from "@mui/material";
import backgroundImage from "../resources/home-background.png";

function SectionOne() {
    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh', // Pełna wysokość widoku
                display: 'flex',
                justifyContent: 'flex-end', // Wyrównanie zawartości do prawej
                alignItems: 'center', // Wyśrodkowanie w pionie
                boxSizing: 'border-box',
                padding: { xs: 2, md: 4 },
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', md: '50%' }, // Pełna szerokość na małych ekranach, 50% na średnich i większych
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Opcjonalnie: półprzezroczyste tło dla lepszej czytelności
                    padding: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' }, // Centruj zawartość na małych ekranach, wyrównaj do lewej na większych
                    textAlign: { xs: 'center', md: 'left' }, // Centruj tekst na małych ekranach
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Twój osobisty kalkulator kalorii i planer posiłków!
                </Typography>
                <Typography variant="h6">
                    Wygląd strony i jej treść do przegadania, myślę jeszcze czy nie zrobić scrollowalnego homepage
                    (cóś takiego: <a href="https://www.youtube.com/watch?v=KAG5wNPdoTw" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>tutaj</a>)
                </Typography>
            </Box>
        </Box>
    );
}

export default SectionOne;
