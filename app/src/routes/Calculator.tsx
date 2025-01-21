import React from "react";
import Button from "@mui/material/Button";
export {};

function Calculator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button variant="contained" color="primary">
        Hello Calculator
      </Button>
    </div>
  );
}

export default Calculator;
