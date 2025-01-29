import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

declare module "@mui/material/styles" {
  interface Palette {
    navBar: Palette["primary"];
    customGreen: Palette["primary"];
    containerDate: Palette["primary"];
  }

  interface PaletteOptions {
    navBar?: PaletteOptions["primary"];
    customGreen?: PaletteOptions["primary"];
    containerDate?: Palette["primary"];
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#e3e3e3",
    },
    secondary: {
      main: "#292525",
    },
    navBar: {
      main: "#8aa251",
    },
    containerDate: {
      main: "#8aa251",
      light: "#aec081",
      dark: "#5b7d36",
      contrastText: "#ffffff",
    },
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

reportWebVitals();
