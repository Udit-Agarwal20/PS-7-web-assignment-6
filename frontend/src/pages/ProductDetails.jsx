import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../api/productApi";
import { fetchProductMovements } from "../api/stockApi";

function ProductDetails({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const [prodData, moveData] = await Promise.all([
          fetchProductById(id, user.token),
          fetchProductMovements(id, user.token),
        ]);
        setProduct(prodData);
        setMovements(moveData);
      } catch (err) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id, user.token]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading product details and movement history...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || "Product not found"}</div>
        <Link to="/products" className="btn btn-secondary">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const isLowStock = product.currentStock <= product.reorderLevel;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/products" className="breadcrumb-link">
            &larr; Back to Products
          </Link>
          <h2>{product.name}</h2>
          <p className="page-subtitle">SKU: {product.sku}</p>
        </div>
        <div className="header-actions">
          <Link to="/stock/in" className="btn btn-outline">
            + Stock IN
          </Link>
          <Link to="/stock/out" className="btn btn-outline">
            - Stock OUT
          </Link>
          {user.role === "admin" && (
            <Link to={`/admin/products/${product._id}/edit`} className="btn btn-secondary">
              Edit Product
            </Link>
          )}
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <span className="detail-label">Current Stock</span>
          <span className={`detail-value ${isLowStock ? "text-danger" : ""}`}>
            {product.currentStock} {product.unit}
          </span>
          {isLowStock && <span className="badge badge-warning">Low Stock Warning</span>}
        </div>

        <div className="detail-card">
          <span className="detail-label">Opening Stock</span>
          <span className="detail-value">
            {product.openingStock} {product.unit}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">Reorder Level</span>
          <span className="detail-value">
            {product.reorderLevel} {product.unit}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">Selling Price</span>
          <span className="detail-value">₹{Number(product.sellingPrice).toFixed(2)}</span>
        </div>

        <div className="detail-card">
          <span className="detail-label">Cost Price</span>
          <span className="detail-value">₹{Number(product.costPrice).toFixed(2)}</span>
        </div>

        <div className="detail-card">
          <span className="detail-label">Category</span>
          <span className="detail-value">{product.category}</span>
        </div>
      </div>

      <div className="section-block">
        <h3>Stock Movement History</h3>
        <p className="section-subtitle">
          Complete audit trail of purchases (IN) and sales (OUT)
        </p>

        {movements.length === 0 ? (
          <div className="state-message empty-state">
            <p>No stock transactions recorded yet for this product.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Selling Price</th>
                  <th>Supplier</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m._id}>
                    <td>{new Date(m.date).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${m.movementType === "IN" ? "badge-success" : "badge-info"}`}>
                        {m.movementType}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {m.quantity} {product.unit}
                      </strong>
                    </td>
                    <td>₹{m.unitCost !== undefined ? Number(m.unitCost).toFixed(2) : "—"}</td>
                    <td>
                      {m.unitSellingPrice !== undefined
                        ? `₹${Number(m.unitSellingPrice).toFixed(2)}`
                        : "—"}
                    </td>
                    <td>{m.supplier ? m.supplier.name : "— (Sale)"}</td>
                    <td>{m.recordedBy ? m.recordedBy.name || m.recordedBy.email : "System"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
