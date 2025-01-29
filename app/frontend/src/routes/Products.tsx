import React from "react";
import Button from "@mui/material/Button";
export {};

function Products() {
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
        Hello Products
      </Button>
    </div>
  );
}

export default Products;
