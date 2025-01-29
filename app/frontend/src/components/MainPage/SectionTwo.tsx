import React from "react";
import { Typography, Box } from "@mui/material";
import backgroundImage from "../../resources/home-bg2.jpg";

function SectionTwo() {
    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'right',
                width: '100%',
                height: '100vh', // Pełna wysokość widoku
                display: 'flex',
                justifyContent: 'flex-start', // Wyrównanie zawartości do prawej
                alignItems: 'center', // Wyśrodkowanie w pionie
                boxSizing: 'border-box',
                padding: { xs: 2, md: 4 },
            }}
        >
            <Box
                sx={{
                    width: { xs: '90%', md: '40%' }, // Pełna szerokość na małych ekranach, 50% na średnich i większych
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
                    Planer Diety!
                </Typography>
                <Typography variant="h6">
                    Ułóż idealny jadłospis dopasowany do Twoich celów! Nasz planer diety pomoże Ci stworzyć zdrowy plan
                    żywieniowy zgodnie z Twoimi preferencjami i zapotrzebowaniem kalorycznym.
                    Wybieraj spośród setek przepisów i śledź swoje postępy.
                </Typography>
            </Box>
        </Box>
    );
}

export default SectionTwo;
