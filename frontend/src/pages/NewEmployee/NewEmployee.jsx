import React, { useState } from "react";
import axios from "axios";

const NewEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    emergencyStatus: "",
    department: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees", // آدرس API برای ذخیره کارمند
        employeeData
      );
      setSuccessMessage("کارمند با موفقیت ذخیره شد!");
      setErrorMessage("");
      setEmployeeData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        emergencyStatus: "",
        department: "",
      });
    } catch (error) {
      setErrorMessage("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      setSuccessMessage("");
      console.error("Error saving employee:", error);
    }
  };

  return (
    <div className="w-[50%] mx-auto my-8 font-yekanBakh">
      <h2 className="text-2xl mb-4">فرم اضافه کردن کارمند جدید</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="نام"
          value={employeeData.firstName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="نام خانوادگی"
          value={employeeData.lastName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="تلفن"
          value={employeeData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="ایمیل"
          value={employeeData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="آدرس"
          value={employeeData.address}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="emergencyStatus"
          value={employeeData.emergencyStatus}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>
            وضعیت اضطراری
          </option>
          <option value="Active">فعال</option>
          <option value="Inactive">غیرفعال</option>
        </select>
        <input
          type="text"
          name="department"
          placeholder="دپارتمان"
          value={employeeData.department}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          افزودن کارمند
        </button>
      </form>
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default NewEmployee;
