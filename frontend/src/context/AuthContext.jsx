import React, { createContext, useContext, useState, useEffect } from "react";

// ایجاد Context
const AuthContext = createContext();

// کامپوننت AuthProvider برای مدیریت وضعیت لاگین
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // شبیه‌سازی وضعیت لاگین با استفاده از sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");

    // بررسی اگر داده‌ها در sessionStorage موجود باشند
    if (savedUser && savedToken) {
      try {
        // تجزیه داده‌ها با استفاده از JSON.parse
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data", error);
        // در صورت بروز خطا در تجزیه JSON، تنظیم مجدد وضعیت
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    }
  }, []); // فقط در بارگذاری اولیه اجرا می‌شود

  // تابع برای ورود کاربر
  const login = (userData, token) => {
    console.log("Logging in:", userData, token); // چاپ داده‌ها برای بررسی
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  };

  // تابع برای خروج کاربر
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken("");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook سفارشی برای استفاده از AuthContext
export const useAuth = () => useContext(AuthContext);
