import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // اطمینان از مسیر صحیح
import "./Sidebar.css";

export default function Sidebar() {
  const { isAuthenticated, logout, user } = useAuth(); // دریافت وضعیت احراز هویت و اطلاعات کاربر
  const navigate = useNavigate();
  const location = useLocation(); // گرفتن مسیر جاری

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    logout(); // به‌روزرسانی وضعیت احراز هویت
    navigate("/login"); // هدایت به صفحه لاگین
    window.location.reload();
  };

  // بررسی فعال بودن لینک
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar font-yekanBakh h-[100vh] bg-slate-100 sticky top-[50px]" style={{ flex: 1 }}>
      <div className="sidebarWrapper p-[20px] text-gray-500">
        {/* بخش داشبورد */}
        <div className="sidebarMenu mb-[10px]">
          <h3 className="sidebarTitle text-[13px] text-gray-400">Dashboard</h3>
          <ul className="sidebarList list-none p-[5px]">
            <Link className="link" to="/">
              <li className={`sidebarListItem ${isActive("/") ? "active" : ""}`}>خانه</li>
            </Link>

            {/* لینک پروفایل تنها برای کاربران وارد شده */}
            {isAuthenticated && (
              <Link className="link" to="/profile">
                <li className={`sidebarListItem ${isActive("/profile") ? "active" : ""}`}>
                  پروفایل
                </li>
              </Link>
            )}
          </ul>
        </div>

        {/* منوی سریع - فقط برای کاربران وارد شده */}
        {isAuthenticated && (
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Quick Menu</h3>
            <ul className="sidebarList">
              {/* فقط برای ادمین‌ها */}
              {user?.admin && (
                <>
                  <Link className="link" to="/upload">
                    <li className={`sidebarListItem ${isActive("/upload") ? "active" : ""}`}>
                      آپلود فایل
                    </li>
                  </Link>
                  <Link className="link" to="/assets">
                    <li className={`sidebarListItem ${isActive("/assets") ? "active" : ""}`}>
                      دارایی
                    </li>
                  </Link>
                  <Link className="link" to="/assets?tab=2">
                    <li
                      className={`sidebarListItem ${
                        isActive("/assets?tab=2") ? "active" : ""
                      }`}
                    >
                      دارایی جدید
                    </li>
                  </Link>
                  <Link className="link" to="/employees">
                    <li
                      className={`sidebarListItem ${
                        isActive("/employees") ? "active" : ""
                      }`}
                    >
                      کارمندان
                    </li>
                  </Link>
                  <Link className="link" to="/employees?tab=1">
                    <li
                      className={`sidebarListItem ${
                        isActive("/employees?tab=1") ? "active" : ""
                      }`}
                    >
                      کارمند جدید
                    </li>
                  </Link>
                  <Link className="link" to="/users">
                    <li className={`sidebarListItem ${isActive("/users") ? "active" : ""}`}>
                      کاربران
                    </li>
                  </Link>
                  <Link className="link" to="/crisisLevel">
                    <li
                      className={`sidebarListItem ${
                        isActive("/crisisLevel") ? "active" : ""
                      }`}
                    >
                      سطح بحران
                    </li>
                  </Link>
                </>
              )}

              {/* گزینه خروج */}
              <li
                className="sidebarListItem cursor-pointer text-red-600 text-sm"
                onClick={handleLogout}
              >
                خروج از حساب کاربری
              </li>
            </ul>
          </div>
        )}

        {/* نمایش لینک‌های ورود و ثبت‌نام برای کاربرانی که لاگین نکرده‌اند */}
        {!isAuthenticated && (
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Authentication</h3>
            <ul className="sidebarList">
              <Link className="link" to="/login">
                <li className={`sidebarListItem ${isActive("/login") ? "active" : ""}`}>
                  ورود
                </li>
              </Link>
              <Link className="link" to="/register">
                <li className={`sidebarListItem ${isActive("/register") ? "active" : ""}`}>
                  ثبت‌نام
                </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
