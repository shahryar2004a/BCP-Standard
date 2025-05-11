import Home from "./pages/Home/Home";
import Assets from "./pages/Assets/Assets";
import Employees from "./pages/Employees/Employees";
import NewAsset from "./pages/NewAsset/NewAsset";
import NewEmployee from "./pages/NewEmployee/NewEmployee";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import UploadPage from "./pages/UploadFile/UploadFile";
import CrisisLevel from "./pages/CrisisLevel/CrisisLevel";
import Users from "./pages/Users/Users";
import { Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider/AuthProvider";
import ResetPasswordRequest from "./pages/ResetPasswordRequest/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <UploadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assets",
    element: (
      <ProtectedRoute>
        <Assets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employees",
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: "/newAsset",
    element: (
      <ProtectedRoute>
        <NewAsset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/newEmployee",
    element: (
      <ProtectedRoute>
        <NewEmployee />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/crisisLevel",
    element: (
      <ProtectedRoute>
        <CrisisLevel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/reset-password-request", element: <ResetPasswordRequest /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  
];

export default routes;
