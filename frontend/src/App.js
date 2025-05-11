import React from "react";
import routes from "./routes";
import { useRoutes, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";

export default function App() {
  const router = useRoutes(routes); // مسیرهای روتینگ

  return (
    <AuthProvider> {/* ارائه‌دهنده AuthContext */}

        <div dir="rtl">
          <Topbar /> {/* نمایش تاپ بار */}
          <div className="container flex w-full">
            <Sidebar /> {/* نمایش ساید بار */}
            <div className="content flex-grow w-[75%]">{router}</div> {/* محتوای رندر شده براساس مسیر */}
          </div>
        </div>
   
    </AuthProvider>
  );
}
