import React from "react";
import { Box } from "@mui/material";
import HomeBar from "../components/HomeBar";
import HomePageContent from "../components/HomePageContent";
import Footer from "../components/Footer";
import backgroundImage from "../resources/home-background.png";

function Home() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <HomeBar />

            {/* Główna przestrzeń z tłem */}
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "flex-end", // Wyrównanie zawartości do prawej
                    alignItems: "center", // Wyśrodkowanie w pionie
                    padding: { xs: 2, md: 4 }, // Responsywne paddingi
                }}
                >
                <HomePageContent />
            </Box>

            <Footer />
        </Box>
    );
}

export default Home;
