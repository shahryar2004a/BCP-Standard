import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!email.includes("@")) {
      setMessage("لطفاً یک ایمیل معتبر وارد کنید");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { email });
      setMessage("✅ لینک بازنشانی رمز عبور به ایمیل شما ارسال شد");
      setError(false);
    } catch (err) {
      setMessage("❌ خطایی رخ داد، لطفاً دوباره تلاش کنید");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 6, mx: "auto", maxWidth: 400, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom sx={{ fontFamily: "Yekan Bakh" }}>
        بازیابی رمز عبور
      </Typography>

      <TextField
        label="ایمیل"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ fontFamily: "Yekan Bakh" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleRequest}
        fullWidth
        disabled={loading}
        sx={{ mt: 2, fontFamily: "Yekan Bakh" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "ارسال لینک بازنشانی"}
      </Button>

      {message && (
        <Typography
          sx={{
            mt: 3,
            fontFamily: "Yekan Bakh",
            color: error ? "error.main" : "success.main",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ResetPasswordRequest;
