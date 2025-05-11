import React, { useState } from 'react';
import axios from 'axios';

function UploadPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    
  };

  const handleUpload = async () => {
    if (!file) {
      alert('لطفاً یک فایل انتخاب کنید.');
      return;
    }

    // Validation برای نوع فایل اکسل
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'application/vnd.ms-excel'
    ) {
      alert('لطفاً فقط فایل اکسل انتخاب کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
     console.log(formData);
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("sdfsdf: ",response);
      alert('فایل با موفقیت آپلود شد!');
      setFile(null); // ریست کردن state
      document.querySelector('input[type="file"]').value = ''; // ریست کردن ورودی فایل
    } catch (error) {
      if (error.response) {
        // خطاهایی که از سرور دریافت می‌شود
        console.error('Server Error:', error.response.data);
        alert('آپلود فایل با مشکل مواجه شد: ' + error.response.data);
      } else {
        // خطاهای ارتباطی
        console.error('Error:', error.message);
        alert('خطای ارتباطی رخ داده است.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">آپلود فایل اکسل</h1>
        
        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && <p className="text-gray-600 mt-2">فایل انتخاب‌شده: {file.name}</p>}
        </div>
        
        {/* Upload Button */}
        <div className="text-center">
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            آپلود
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
