import React from "react";
import Button from "@mui/material/Button";
export {};

function Home() {
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
        Hello Home
      </Button>
    </div>
  );
}

export default Home;
