import React from "react";
import { Box } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import Footer from "../components/Common/Footer";
import backgroundImage from "../resources/BMI-background.jpg";
import BMICalculatorContent from "../components/BMICalculator/BMICalculatorContent";

function BMICalculator() {


    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <HomeBar />

            <BMICalculatorContent/>

            <Footer />
        </Box>
    );
}

export default BMICalculator;
