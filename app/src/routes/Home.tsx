// Home.js
import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import HomeBar from "../components/HomeBar";
import Footer from "../components/Footer";
import SectionOne from "../components/SectionOne";
import SectionTwo from "../components/SectionTwo";
import SectionThree from "../components/SectionThree";

const anchors = ["section1", "section2", "section3"];

function Home() {
    return (
        <div>
            <HomeBar />
            <ReactFullpage
                anchors={anchors}
                navigation
                navigationTooltips={["Sekcja 1", "Sekcja 2", "Sekcja 3"]}
                sectionsColor={["#f5f5f5", "#e0f7fa", "#ffe0b2"]}
                scrollingSpeed={700} // Prędkość przewijania w milisekundach
                credits={{ enabled: false }} // Wyłączenie kredytów
                render={() => {
                    return (
                        <ReactFullpage.Wrapper>
                            <div className="section">
                                <SectionOne />
                            </div>
                            <div className="section">
                                <SectionTwo />
                            </div>
                            <div className="section">
                                <SectionThree />
                            </div>
                        </ReactFullpage.Wrapper>
                    );
                }}
            />
            <Footer />
        </div>
    );
}

export default Home;
