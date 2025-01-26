import React, { FC } from "react";
import { Box, Typography, Modal, TextField, Button } from "@mui/material";

interface GramsModalProps {
  open: boolean;
  product: any | null;
  grams: number | null;
  error: string | null;
  onClose: () => void;
  onGramsChange: (grams: number) => void;
  onSubmit: () => void;
}

const GramsModal: FC<GramsModalProps> = ({
  open,
  product,
  grams,
  error,
  onClose,
  onGramsChange,
  onSubmit,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        width: "auto",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Wprowadź ilość gramów dla:
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: "20px" }}>
        {product?.name || "Nie wybrano produktu"}
      </Typography>
      <TextField
        fullWidth
        type="number"
        placeholder="Ilość gramów"
        variant="outlined"
        value={grams || ""}
        onChange={(e) => onGramsChange(Number(e.target.value))}
        sx={{ marginBottom: "20px" }}
        error={!!error}
        helperText={error}
      />
      <Box display="flex" justifyContent="flex-end" gap="10px">
        <Button onClick={onClose} color="error" variant="outlined">
          Anuluj
        </Button>
        <Button onClick={onSubmit} color="primary" variant="contained">
          Zatwierdź
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default GramsModal;
