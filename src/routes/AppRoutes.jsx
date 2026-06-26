import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Register from "../pages/Register";
import Categories from "../pages/Categories";
import Dashboard from "../pages/Dashboard";
import Movies from "../pages/Movies";

// Guard that checks if user registration details are complete
const RequireAuth = ({ children }) => {
  const user = useStore((state) => state.user);
  const isRegistered = user && user.name && user.username && user.email && user.mobile;
  
  return isRegistered ? children : <Navigate to="/" replace />;
};

// Guard that checks if the user has selected at least 3 onboarding categories
const RequireCategories = ({ children }) => {
  const categories = useStore((state) => state.categories);
  
  return categories && categories.length >= 3 ? children : <Navigate to="/categories" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route
        path="/categories"
        element={
          <RequireAuth>
            <Categories />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireCategories>
              <Dashboard />
            </RequireCategories>
          </RequireAuth>
        }
      />
      <Route
        path="/movies"
        element={
          <RequireAuth>
            <RequireCategories>
              <Movies />
            </RequireCategories>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
