import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { email });
      setMessage("لینک بازنشانی رمز عبور به ایمیل شما ارسال شد");
    } catch (error) {
      setMessage("خطایی رخ داد، لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        بازیابی رمز عبور
      </Typography>
      <TextField
        label="ایمیل"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleRequest} fullWidth>
        ارسال لینک بازنشانی
      </Button>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default ResetPasswordRequest;
