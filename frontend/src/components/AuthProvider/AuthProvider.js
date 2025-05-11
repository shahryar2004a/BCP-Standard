import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // شبیه‌سازی وضعیت لاگین با استفاده از LocalStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // بارگذاری اطلاعات کاربر از localStorage
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // ذخیره اطلاعات کاربر در localStorage
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user"); // حذف اطلاعات کاربر از localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
