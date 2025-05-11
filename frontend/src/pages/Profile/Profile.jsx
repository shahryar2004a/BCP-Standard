import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordField = ({ label, value, onChange, show, toggle }) => (
  <TextField
    label={label}
    type={show ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={toggle}>
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const UserProfile = () => {
  const navigate = useNavigate();
  const userSession = JSON.parse(sessionStorage.getItem('user'));
  const userId = userSession?.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [originalUser, setOriginalUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setFormData((prev) => ({ ...prev, name: data.name, email: data.email }));
      setOriginalUser({ name: data.name, email: data.email });
    } catch {
      setError('خطا در دریافت اطلاعات کاربر');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [fetchUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setIsChanged(updated.name !== originalUser.name || updated.email !== originalUser.email);
      return updated;
    });
  };

  const handleSaveGeneralInfo = async () => {
    try {
      const { name, email } = formData;
      await axios.put(`http://localhost:5000/api/users/${userId}`, { name, email });
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      alert('اطلاعات با موفقیت ذخیره شد. لطفاً دوباره وارد شوید.');
      navigate('/login');
      window.location.reload();
    } catch {
      alert('خطا در ذخیره اطلاعات');
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setPasswordError('رمز عبور جدید و تکرار آن یکسان نیست');
      return;
    }

    try {
      const check = await axios.post('http://localhost:5000/api/users/check-password', {
        userId,
        currentPassword,
      });

      if (!check.data.valid) {
        setPasswordError('رمز عبور فعلی اشتباه است');
        return;
      }

      await axios.put(`http://localhost:5000/api/users/change-password/${userId}`, {
        newPassword,
      });

      alert('رمز عبور با موفقیت تغییر یافت');
      navigate('/login');
    } catch {
      setPasswordError('خطا در تغییر رمز عبور');
    }
  };

  if (loading) return <Typography>در حال بارگذاری...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box dir="rtl" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom fontFamily="Yekan Bakh">
        پروفایل کاربر
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="نام"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="ایمیل"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveGeneralInfo}
            disabled={!isChanged}
            sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
          >
            ذخیره اطلاعات
          </Button>
        </Grid>

        <Grid item xs={12}>
          <PasswordField
            label="رمز عبور فعلی"
            value={formData.currentPassword}
            onChange={(e) => handleChange({ target: { name: 'currentPassword', value: e.target.value } })}
            show={showPassword}
            toggle={() => setShowPassword((prev) => !prev)}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordField
            label="رمز عبور جدید"
            value={formData.newPassword}
            onChange={(e) => handleChange({ target: { name: 'newPassword', value: e.target.value } })}
            show={showPassword}
            toggle={() => setShowPassword((prev) => !prev)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="تایید رمز عبور جدید"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handlePasswordChange}
            disabled={
              !formData.currentPassword || !formData.newPassword || !formData.confirmPassword
            }
            sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
          >
            تغییر رمز عبور
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
