import { Box } from "@mui/material";
import HomeBar from "../components/Common/HomeBar";
import Footer from "../components/Common/Footer";
import CalorieCalculatorContent from "../components/CalorieCalculator/CalorieCalculatorContent";
import bgImage from "../resources/calorie-background.jpg";

function CalorieCalculator() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden", // Zapobiega przewijaniu w poziomie
                overflowY: "auto",
                msOverflowStyle: 'hidden',
            }}
        >
            <HomeBar />
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw", // Zapobiega przewijaniu w poziomie
                    minHeight: "calc(100vh)", // Odejmowanie wysokości nagłówka i stopki (jeśli znane)
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 4,
                        width: "90%", // Zapewnienie responsywności
                        maxWidth: "600px",
                        padding: 3,
                        boxShadow: 3, // Dodanie subtelnego cienia
                        height: "110%",
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
