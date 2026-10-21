import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productApi";
import { fetchSuppliers } from "../api/supplierApi";
import { recordStockIn } from "../api/stockApi";

function StockIn({ user }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [prodList, supList] = await Promise.all([
          fetchProducts(user.token),
          fetchSuppliers(user.token),
        ]);
        setProducts(prodList);
        setSuppliers(supList);

        if (prodList.length > 0) {
          setSelectedProduct(prodList[0]._id);
          setUnitCost(prodList[0].costPrice || "");
        }
        if (supList.length > 0) {
          setSelectedSupplier(supList[0]._id);
        }
      } catch (err) {
        setError(err.message || "Failed to load products or suppliers");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.token]);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProduct(prodId);
    const prod = products.find((p) => p._id === prodId);
    if (prod) {
      setUnitCost(prod.costPrice || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await recordStockIn(
        {
          productId: selectedProduct,
          supplierId: selectedSupplier,
          quantity: Number(quantity),
          unitCost: Number(unitCost),
        },
        user.token
      );

      setSuccess(
        `Successfully received ${result.movement.quantity} units! New stock: ${result.product.currentStock} ${result.product.unit}.`
      );
      setQuantity("");
    } catch (err) {
      setError(err.message || "Failed to record Stock IN");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading products and suppliers...</p>
        </div>
      </div>
    );
  }

  const currentProd = products.find((p) => p._id === selectedProduct);

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Record Stock IN (Purchase)</h2>
          <p className="page-subtitle">
            Receive incoming stock from an approved supplier and increase inventory
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {products.length === 0 ? (
          <div className="state-message empty-state">
            <p>No products available to receive stock.</p>
            {user.role === "admin" && (
              <Link to="/admin/products/new" className="btn btn-primary">
                Create a Product First
              </Link>
            )}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="state-message empty-state">
            <p>No suppliers found. A supplier is required to record Stock IN.</p>
            {user.role === "admin" && (
              <Link to="/admin/suppliers" className="btn btn-primary">
                Add a Supplier
              </Link>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="stock-form">
            <div className="form-group">
              <label htmlFor="productSelect">Select Product</label>
              <select
                id="productSelect"
                value={selectedProduct}
                onChange={handleProductChange}
                required
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku}) — Current Stock: {p.currentStock} {p.unit}
                  </option>
                ))}
              </select>
              {currentProd && (
                <small className="form-hint">
                  Current Stock: <strong>{currentProd.currentStock} {currentProd.unit}</strong> |
                  Standard Cost: ₹{Number(currentProd.costPrice).toFixed(2)}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="supplierSelect">Supplier</label>
              <select
                id="supplierSelect"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                required
              >
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity to Receive</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="e.g. 20"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unitCost">Purchase Unit Cost (₹)</label>
                <input
                  id="unitCost"
                  type="number"
                  min="0"
                  step="any"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Recording..." : "Confirm Stock IN"}
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

export default StockIn;
