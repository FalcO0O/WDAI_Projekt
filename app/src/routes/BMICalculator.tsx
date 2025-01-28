import React from "react";
import { Typography, Box, TextField, Grid } from "@mui/material";
import HomeBar from "../components/HomeBar";
import Footer from "../components/Footer";
import backgroundImage from "../resources/BMI-background.jpg";

function BMICalculator() {
    const [height, setHeight] = React.useState<number>(0);
    const [weight, setWeight] = React.useState<number>(0);

    const BMI = height > 0 && weight > 0 ? (weight / (height * height / 10000)) : 0;

    const getBMICategory = (bmi: number): string => {
        switch (true) {
            case bmi < 16:
                return "Wygłodzenie";
            case bmi >= 16 && bmi < 17:
                return "Wychudzenie";
            case bmi >= 17 && bmi < 18.5:
                return "Niedowaga";
            case bmi >= 18.5 && bmi < 25:
                return "Prawidłowa masa ciała";
            case bmi >= 25 && bmi < 30:
                return "Nadwaga";
            case bmi >= 30 && bmi < 35:
                return "Otyłość I stopnia";
            case bmi >= 35 && bmi < 40:
                return "Otyłość II stopnia";
            case bmi >= 40:
                return "Otyłość III stopnia (skrajna)";
            default:
                return "Nieprawidłowe dane";
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <HomeBar />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: { xs: "10px", sm: "20px" },
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "rgba(238, 241, 238, 0.99)",
                        borderRadius: "20px",
                        boxShadow: 3,
                        padding: { xs: "20px", sm: "40px" },
                        maxWidth: "800px", // Maksymalna szerokość
                        width: "100%",      // Szerokość 100% rodzica
                        boxSizing: "border-box",
                        overflow: "auto",
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Oblicz swoje BMI!
                    </Typography>

                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Wprowadź wagę (kg)
                            </Typography>
                            <TextField
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={weight}
                                onChange={e => setWeight(Number(e.target.value))}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Wprowadź wzrost (cm)
                            </Typography>
                            <TextField
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={height}
                                onChange={e => setHeight(Number(e.target.value))}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                {(weight === 0 || height === 0)
                                    ? "Wpisz swoje dane!"
                                    : `Twoje BMI to: ${BMI.toFixed(2)}, oznacza to: ${getBMICategory(BMI)}`
                                }
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src="https://austingynecomastiacenter.com/assets/img/blog/BMI-Chart-Detailed.png"
                                    alt="BMI Chart"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "550px",
                                        height: "auto",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

export default BMICalculator;
