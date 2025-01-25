import React from "react";
import { Typography, Box } from "@mui/material";
import backgroundImage from "../resources/home-bg3.jpg";

function SectionThree() {
    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'left',
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
                    alignItems: { xs: 'center', md: 'flex-end' }, // Centruj zawartość na małych ekranach, wyrównaj do lewej na większych
                    textAlign: { xs: 'center', md: 'left' }, // Centruj tekst na małych ekranach
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Porady i Analizy
                </Typography>
                <Typography variant="h6">
                    Dowiedz się więcej o zdrowym odżywianiu! Oferujemy praktyczne wskazówki, artykuły
                    ekspertów i analizy Twojej diety, które pomogą Ci osiągnąć wymarzoną sylwetkę i poprawić
                    samopoczucie. Dbaj o zdrowie z nami!
                </Typography>
            </Box>
        </Box>
    );
}

export default SectionThree;
