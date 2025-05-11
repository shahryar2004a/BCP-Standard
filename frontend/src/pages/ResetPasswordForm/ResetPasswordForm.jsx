import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/reset-password/confirm", {
        token,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("خطا در بازنشانی رمز عبور");
    }
  };

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        بازنشانی رمز عبور
      </Typography>
      <TextField
        label="رمز عبور جدید"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        ذخیره رمز عبور جدید
      </Button>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default ResetPasswordForm;
