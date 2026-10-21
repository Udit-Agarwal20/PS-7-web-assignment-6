import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../api/dashboardApi";

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchDashboardStats(user.token);
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user.token]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          <div className="spinner"></div>
          <p>Calculating inventory metrics from live database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Executive Inventory Dashboard</h2>
          <p className="page-subtitle">
            Real-time shop metrics for reporting date:{" "}
            <strong>{stats ? stats.reportingDate : "Today"}</strong> ({stats ? stats.timezone : "Asia/Kolkata"})
          </p>
        </div>
        <button onClick={loadStats} className="btn btn-outline">
          Refresh Metrics
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{stats.totalProducts}</span>
              <span className="stat-hint">Active items in catalog</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Stock Value</span>
              <span className="stat-value">₹{Number(stats.totalStockValue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              <span className="stat-hint">Sum of (Quantity × Cost Price)</span>
            </div>

            <div className={`stat-card ${stats.lowStockCount > 0 ? "stat-card-warning" : ""}`}>
              <span className="stat-label">Low Stock Alerts</span>
              <span className="stat-value">{stats.lowStockCount}</span>
              <span className="stat-hint">
                <Link to="/low-stock" className="stat-link">
                  View Low-Stock Items &rarr;
                </Link>
              </span>
            </div>

            <div className="stat-card stat-card-highlight">
              <span className="stat-label">Today's Sales</span>
              <span className="stat-value">₹{Number(stats.todaySales).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              <span className="stat-hint">Sum of today's Stock OUT revenue</span>
            </div>

            <div className="stat-card stat-card-profit">
              <span className="stat-label">Today's Profit</span>
              <span className="stat-value">₹{Number(stats.todayProfit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              <span className="stat-hint">Sales revenue minus historical unit cost</span>
            </div>
          </div>

          <div className="quick-actions-bar">
            <h3>Quick Inventory Actions</h3>
            <div className="action-buttons">
              <Link to="/admin/products/new" className="btn btn-primary">
                + Add New Product
              </Link>
              <Link to="/stock/in" className="btn btn-secondary">
                Receive Stock IN
              </Link>
              <Link to="/stock/out" className="btn btn-secondary">
                Record Stock OUT
              </Link>
              <Link to="/low-stock" className="btn btn-outline">
                Check Low Stock
              </Link>
              <Link to="/admin/suppliers" className="btn btn-outline">
                Manage Suppliers
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
