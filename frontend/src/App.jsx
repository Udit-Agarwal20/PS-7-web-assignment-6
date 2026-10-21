import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import LowStock from "./pages/LowStock";
import Suppliers from "./pages/Suppliers";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("shop_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  const handleLoginSuccess = (token, userData) => {
    const sessionData = { ...userData, token };
    setUser(sessionData);
    localStorage.setItem("shop_user", JSON.stringify(sessionData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("shop_user");
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/products" : "/login"} replace />}
          />

          <Route
            path="/login"
            element={
              user ? <Navigate to="/products" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="/register"
            element={user ? <Navigate to="/products" replace /> : <Register />}
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute user={user}>
                <Products user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute user={user}>
                <ProductDetails user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock/in"
            element={
              <ProtectedRoute user={user}>
                <StockIn user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock/out"
            element={
              <ProtectedRoute user={user}>
                <StockOut user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/low-stock"
            element={
              <ProtectedRoute user={user}>
                <LowStock user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AddProduct user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <EditProduct user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/suppliers"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <Suppliers user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Shop Inventory &amp; Stock Management System — PS7 (Academic MERN Project)</p>
      </footer>
    </div>
  );
}

export default App;
