import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import { CenterFocusStrong } from "@mui/icons-material";

function App() {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button variant="contained" color="primary">
          Hello Material-UI
        </Button>
      </div>
    </div>
  );
}

export default App;
