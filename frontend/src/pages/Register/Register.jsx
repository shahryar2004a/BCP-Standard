import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        admin,
      });

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // هدایت به صفحه لاگین پس از ثبت‌نام موفق
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ارتباط با سرور.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">ثبت‌نام</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

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
          ثبت‌نام
        </button>
      </form>

      <p className="text-center mt-4">
        حساب کاربری دارید؟{" "}
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => navigate("/login")}
        >
          ورود
        </button>
      </p>
    </div>
  );
};

export default Register;
