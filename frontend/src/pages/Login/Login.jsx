
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';

export default function Login() {
  const navigate = useNavigate();

  const loginFn = async ({ email, password }) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    navigate('/');
    window.location.reload();
  };

  return (
    <AuthForm
      title="ورود به حساب کاربری"
      submitLabel="ورود"
      onSubmit={loginFn}
      fields={[
        { name: 'email', label: 'ایمیل', type: 'email' },
        { name: 'password', label: 'رمز عبور', type: 'password' }
      ]}
      footerText="حساب کاربری ندارید؟"
      footerLink={{ label: 'ثبت‌نام کنید', to: '/register' }}
    />
  );
}