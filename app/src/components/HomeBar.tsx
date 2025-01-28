import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import icon from "../resources/icon.png";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

import { buttonStyle } from "../styles/style";

function HomeBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "navBar.main",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <img
            src={icon}
            alt="Logo"
            height="60"
            style={{ padding: 5, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 4 }}>
            <Button
                sx={{
                    ...buttonStyle,
                    fontWeight: isActive("/BMI_calculator") ? "bold" : "normal",
                }}
                onClick={() => navigate("/BMI_calculator")}
            >
                Kalkulator BMI
            </Button>
            <Button
            sx={{
              ...buttonStyle,
              fontWeight: isActive("/calorie_calculator") ? "bold" : "normal",
            }}
            onClick={() => navigate("/calorie_calculator")}
          >
            Kalkulator kalorii
          </Button>
          <Button
            sx={{
              ...buttonStyle,
              fontWeight: isActive("/planner") ? "bold" : "normal",
            }}
            onClick={() => navigate("/planner")}
          >
            Zaplanuj posiłek
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            sx={{
              ...buttonStyle,
              fontWeight: isActive("/login") ? "bold" : "normal",
            }}
            onClick={() => navigate("/login")}
          >
            Zaloguj
          </Button>
          <Button
            sx={{
              ...buttonStyle,
              fontWeight: isActive("/register") ? "bold" : "normal",
            }}
            onClick={() => navigate("/register")}
          >
            Zarejestruj się
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HomeBar;
