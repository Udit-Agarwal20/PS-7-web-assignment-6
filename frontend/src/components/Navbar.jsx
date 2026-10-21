import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/products" className="brand-logo">
          Shop Inventory
        </NavLink>
        {user && (
          <span className={`role-badge ${user.role}`}>
            {user.role}
          </span>
        )}
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Products
            </NavLink>
            <NavLink to="/low-stock" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Low Stock
            </NavLink>
            <NavLink to="/stock/in" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Stock IN
            </NavLink>
            <NavLink to="/stock/out" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Stock OUT
            </NavLink>

            {user.role === "admin" && (
              <>
                <NavLink to="/admin/products/new" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  + Add Product
                </NavLink>
                <NavLink to="/admin/suppliers" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Suppliers
                </NavLink>
                <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Dashboard
                </NavLink>
              </>
            )}

            <div className="user-profile">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
