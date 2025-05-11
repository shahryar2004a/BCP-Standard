
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const { name, email, password } = values;
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password,
    });
    setTimeout(() => navigate('/login'), 2000);
    return response.data.message;
  };

  const fields = [
    { name: 'name', label: 'نام', type: 'text' },
    { name: 'email', label: 'ایمیل', type: 'email' },
    { name: 'password', label: 'رمز عبور', type: 'password' },
  ];

  return (
    <AuthForm
      title="ثبت‌نام"
      fields={fields}
      submitLabel="ثبت‌نام"
      onSubmit={handleRegister}
      footerText="حساب کاربری دارید؟"
      footerLink={{ label: 'ورود', to: '/login', onClick: () => navigate('/login') }}
    />
  );
};

export default Register;
