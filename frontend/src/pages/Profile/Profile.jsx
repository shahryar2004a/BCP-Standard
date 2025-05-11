import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: '',
    email: '',
    pass: '',
  });
  const [originalUser, setOriginalUser] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const userSession = JSON.parse(sessionStorage.getItem('user'));
  const [userId, setUserId] = useState(userSession?.id);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUser(response.data);
      setOriginalUser(response.data);
      setLoading(false);
    } catch (error) {
      setError('خطا در دریافت اطلاعات کاربر');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (originalUser[name] !== value) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleSaveGeneralInfo = async () => {
    try {
      const payload = { name: user.name, email: user.email };
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, payload);

      if (response.status === 200) {
        alert('اطلاعات عمومی با موفقیت ذخیره شد');
        sessionStorage.setItem('user', JSON.stringify({ ...user }));
        fetchUserProfile();
        setOriginalUser({
          ...originalUser,
          name: user.name,
          email: user.email,
        });
        setIsChanged(false);
      }
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      navigate('/login')
      window.location.reload();

    } catch (error) {
      alert('خطا در ذخیره اطلاعات عمومی');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('رمز عبور جدید و تایید آن مطابقت ندارد');
      return;
    }

    try {
      const passwordCheckResponse = await axios.post('http://localhost:5000/api/users/check-password', {
        userId,
        currentPassword,
      });

      if (!passwordCheckResponse.data.valid) {
        setPasswordError('رمز عبور فعلی اشتباه است');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/users/change-password/${userId}`, {
        newPassword,
      });

      if (response.status === 200) {
        alert('رمز عبور با موفقیت تغییر کرد');
        navigate('/login');
      }
    } catch (error) {
      setPasswordError('خطا در تغییر رمز عبور');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) return <Typography>در حال بارگذاری...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box dir="rtl" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="h5" gutterBottom>
        پروفایل کاربر
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="نام"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="ایمیل"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveGeneralInfo}
            fullWidth
            sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
            disabled={!isChanged}
          >
            ذخیره تغییرات اطلاعات عمومی
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="رمز عبور فعلی"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="رمز عبور جدید"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="تایید رمز عبور جدید"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePasswordChange}
            fullWidth
            sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            تغییر رمز عبور
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
