import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchLowStockProducts } from "../api/stockApi";

function LowStock({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLowStock = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchLowStockProducts(user.token);
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load low-stock products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowStock();
  }, [user.token]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Low Stock Alerts</h2>
          <p className="page-subtitle">
            Products at or below their designated reorder threshold ({products.length} items flagged)
          </p>
        </div>
        <Link to="/stock/in" className="btn btn-primary">
          + Record Stock IN
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="state-message">
          <div className="spinner"></div>
          <p>Scanning inventory for low-stock items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="state-message empty-state">
          <div className="empty-icon">✓</div>
          <h3>Inventory is Healthy!</h3>
          <p>No products are currently at or below their reorder level.</p>
          <Link to="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Deficit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const deficit = p.reorderLevel - p.currentStock;
                const isCritical = p.currentStock === 0;

                return (
                  <tr key={p._id} className="row-warning">
                    <td className="font-mono">{p.sku}</td>
                    <td>
                      <Link to={`/products/${p._id}`} className="table-link">
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <strong className={isCritical ? "text-danger" : "text-warning"}>
                        {p.currentStock} {p.unit}
                      </strong>
                    </td>
                    <td>
                      {p.reorderLevel} {p.unit}
                    </td>
                    <td>
                      <span className="text-danger">
                        {deficit > 0 ? `-${deficit} ${p.unit}` : `0 ${p.unit}`}
                      </span>
                    </td>
                    <td>
                      {isCritical ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : (
                        <span className="badge badge-warning">Low Stock</span>
                      )}
                    </td>
                    <td>
                      <Link to="/stock/in" className="btn btn-sm btn-primary">
                        + Restock
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LowStock;
