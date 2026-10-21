import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/productApi";
import { recordStockOut } from "../api/stockApi";

function StockOut({ user }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const prodList = await fetchProducts(user.token);
      setProducts(prodList);
      if (prodList.length > 0) {
        setSelectedProduct(prodList[0]._id);
      }
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user.token]);

  const currentProd = products.find((p) => p._id === selectedProduct);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentProd) {
      setError("Please select a valid product");
      return;
    }

    const numQty = Number(quantity);
    if (numQty > currentProd.currentStock) {
      setError(
        `Insufficient stock! Only ${currentProd.currentStock} ${currentProd.unit} available in inventory.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await recordStockOut(
        {
          productId: selectedProduct,
          quantity: numQty,
        },
        user.token
      );

      setSuccess(
        `Sale recorded successfully! ${result.movement.quantity} units sold. Remaining stock: ${result.product.currentStock} ${result.product.unit}.`
      );
      setQuantity("");

      // Refresh product list stock
      setProducts((prev) =>
        prev.map((p) => (p._id === result.product._id ? result.product : p))
      );
    } catch (err) {
      setError(err.message || "Failed to record Stock OUT");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Record Stock OUT (Sale)</h2>
          <p className="page-subtitle">
            Record retail customer sales and automatically deduct units from stock
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {products.length === 0 ? (
          <div className="state-message empty-state">
            <p>No products available to sell.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="stock-form">
            <div className="form-group">
              <label htmlFor="productSelect">Select Product to Sell</label>
              <select
                id="productSelect"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku}) — Available: {p.currentStock} {p.unit}
                  </option>
                ))}
              </select>

              {currentProd && (
                <div className="stock-info-box">
                  <div className="stock-stat">
                    <span>Available Stock:</span>
                    <strong className={currentProd.currentStock === 0 ? "text-danger" : ""}>
                      {currentProd.currentStock} {currentProd.unit}
                    </strong>
                  </div>
                  <div className="stock-stat">
                    <span>Selling Price:</span>
                    <strong>₹{Number(currentProd.sellingPrice).toFixed(2)}</strong>
                  </div>
                  <div className="stock-stat">
                    <span>Reorder Level:</span>
                    <span>{currentProd.reorderLevel} {currentProd.unit}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity to Sell</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={currentProd ? currentProd.currentStock : undefined}
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                disabled={!currentProd || currentProd.currentStock <= 0}
                placeholder={
                  currentProd && currentProd.currentStock <= 0
                    ? "Out of stock!"
                    : "e.g. 5"
                }
              />
              {currentProd && currentProd.currentStock <= 0 && (
                <small className="text-danger">
                  This product is out of stock. Record Stock IN before selling.
                </small>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  submitting ||
                  !currentProd ||
                  currentProd.currentStock <= 0 ||
                  !quantity ||
                  Number(quantity) <= 0
                }
              >
                {submitting ? "Processing Sale..." : "Confirm Stock OUT"}
              </button>
              {currentProd && (
                <Link to={`/products/${currentProd._id}`} className="btn btn-outline">
                  View Movement History
                </Link>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default StockOut;
