import React from "react";
import { Alert, Box } from "@mui/material";

interface MessageDisplayProps {
  error: string;
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ error, message }) => {
  return (
    <Box sx={{ width: "100%", marginTop: "16px" }}>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
    </Box>
  );
};

export default MessageDisplay;
