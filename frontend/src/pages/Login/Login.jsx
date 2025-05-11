import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // ریست کردن خطا

    try {
      console.log(email, password);
      // ارسال درخواست برای لاگین
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log(response);

      const { token, user } = response.data; // فرض اینکه سرور توکن و اطلاعات کاربر را ارسال می‌کند

      // ذخیره توکن و اطلاعات کاربر در sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // هدایت به صفحه اصلی پس از موفقیت
      navigate("/");
      window.location.reload(); // بارگذاری مجدد صفحه برای اعمال تغییرات
    } catch (err) {
      // چاپ جزئیات خطا
      console.error(err.response ? err.response.data : err.message);
      setError("ایمیل یا رمز عبور اشتباه است");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">ورود به حساب کاربری</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          ورود
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          حساب کاربری ندارید؟{" "}
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => navigate("/register")}
          >
            ثبت‌نام کنید
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
