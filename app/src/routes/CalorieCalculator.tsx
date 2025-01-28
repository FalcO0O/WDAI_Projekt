import { Box } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import Footer from "../components/Common/Footer";
import CalorieCalculatorContent from "../components/CalorieCalculator/CalorieCalculatorContent";
import bgImage from "../resources/calorie-background.jpg";

function CalorieCalculator() {
    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <HomeBar />
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    display: "flex", // Ustawienie flex na rodzicu
                    justifyContent: "center", // Centrowanie w poziomie
                    alignItems: "center", // Centrowanie w pionie
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 4,
                        width: "50%", // Możesz dostosować szerokość
                        maxWidth: "600px", // Maksymalna szerokość
                        padding: 3, // Dodanie paddingu dla lepszego wyglądu
                    }}
                >
                    <CalorieCalculatorContent />
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}

export default CalorieCalculator;