import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Theme,
  SxProps,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../resources/icon.png";
import Login from "./Login";

const buttonSx: SxProps<Theme> = {
  color: "#fff",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};

export function HomeBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Snackbar do komunikatu "Musisz być zalogowany..."
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Snackbar do komunikatu o wylogowaniu
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  // Funkcja sprawdzająca, czy aktualna ścieżka pokrywa się z podaną
  const isActive = (path: string): boolean => location.pathname === path;

  // Sprawdź, czy użytkownik jest zalogowany (czy jest accessToken w localStorage)
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  /**
   * Obsługa "Zaplanuj posiłek"
   */
  const handleGoToPlanner = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Pokaż komunikat "Musisz być zalogowany..."
      setSnackbarOpen(true);
    } else {
      // Przejdź do /planner
      navigate("/planner");
    }
  };

  /**
   * Funkcja wylogowania
   * Usuwa tokeny i userID z localStorage, pokazuje snackbar, przekierowuje do "/"
   */
  const handleLogout = () => {
    // Usuwamy dane z localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");

    // Pokażmy snackbar z informacją o wylogowaniu
    setLogoutSnackbarOpen(true);

    // Opcjonalnie przekieruj na stronę główną
    navigate("/");
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "navBar.main", // Zmień kolor według potrzeb
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          {/* LOGO (kliknięcie w nie przenosi do "/" ) */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={Logo} width={50} alt="Logo" />
          </Box>

          {/* Ikona menu (hamburger) - małe ekrany */}
          <IconButton
            edge="end"
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Menu główne - większe ekrany */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { xs: 2, md: 3 },
            }}
          >
            <Button
              sx={{
                ...buttonSx,
                fontWeight: isActive("/BMI_calculator") ? "bold" : "normal",
              }}
              onClick={() => navigate("/BMI_calculator")}
            >
              Kalkulator BMI
            </Button>
            <Button
              sx={{
                ...buttonSx,
                fontWeight: isActive("/calorie_calculator") ? "bold" : "normal",
              }}
              onClick={() => navigate("/calorie_calculator")}
            >
              Kalkulator kalorii
            </Button>
            {/* Zaplanuj posiłek */}
            <Button
              sx={{
                ...buttonSx,
                fontWeight: isActive("/planner") ? "bold" : "normal",
              }}
              onClick={handleGoToPlanner}
            >
              Zaplanuj posiłek
            </Button>
            <Button
              sx={{
                ...buttonSx,
                fontWeight: isActive("/recipes") ? "bold" : "normal",
              }}
              onClick={() => navigate("/recipes")}
            >
              Przepisy
            </Button>
          </Box>

          {/* Przyciski logowania/rejestracji lub wylogowania - większe ekrany */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { xs: 2, md: 3 },
            }}
          >
            {isLoggedIn ? (
              // Jeśli zalogowany, pokazujemy przycisk "Wyloguj"
              <Button sx={buttonSx} onClick={handleLogout}>
                Wyloguj
              </Button>
            ) : (
              // Jeśli niezalogowany, pokaż logowanie + rejestrację
              <>
                <Login
                  isListItem={false}
                  open={loginOpen}
                  setOpen={setLoginOpen}
                />
                <Button
                  sx={{
                    ...buttonSx,
                    fontWeight: isActive("/register") ? "bold" : "normal",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Zarejestruj się
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Boczne menu (Drawer) - małe ekrany */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/BMI_calculator");
                setMenuOpen(false);
              }}
            >
              Kalkulator BMI
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/calorie_calculator");
                setMenuOpen(false);
              }}
            >
              Kalkulator kalorii
            </ListItemButton>
          </ListItem>
          {/* Zaplanuj posiłek w drawerze */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setMenuOpen(false);
                handleGoToPlanner();
              }}
            >
              Zaplanuj posiłek
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/calorie_calculator");
                setMenuOpen(false);
              }}
            >
              Przepisy
            </ListItemButton>
          </ListItem>

          {/* W zależności czy zalogowany */}
          {isLoggedIn ? (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Wyloguj
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding onClick={() => setMenuOpen(false)}>
                <Login
                  isListItem={true}
                  open={loginOpen}
                  setOpen={setLoginOpen}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                >
                  Zarejestruj się
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Snackbar: Musisz być zalogowany... */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Musisz być zalogowany, aby skorzystać z planera!
        </Alert>
      </Snackbar>

      {/* Snackbar: Wylogowano pomyślnie */}
      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setLogoutSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setLogoutSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Wylogowano pomyślnie!
        </Alert>
      </Snackbar>
    </>
  );
}

export default HomeBar;
