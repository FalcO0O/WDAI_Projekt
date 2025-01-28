// src/components/MessageDisplay.tsx
import React from "react";
import { Typography, Box } from "@mui/material";

interface MessageDisplayProps {
  error: string;
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ error, message }) => {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      {message && (
        <Typography color="primary" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default MessageDisplay;
