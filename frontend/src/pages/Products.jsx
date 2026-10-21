import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../api/productApi";

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProducts(user.token);
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user.token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setActionMessage("");
      setError("");
      await deleteProduct(id, user.token);
      setActionMessage(`Product "${name}" deleted successfully.`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Product Inventory</h2>
          <p className="page-subtitle">Manage store products, stock levels, and prices</p>
        </div>
        {user.role === "admin" && (
          <Link to="/admin/products/new" className="btn btn-primary">
            + Add New Product
          </Link>
        )}
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label htmlFor="cat-select">Category: </label>
          <select
            id="cat-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading products from database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="state-message empty-state">
          <p>No products found matching your criteria.</p>
          {products.length === 0 && user.role === "admin" && (
            <Link to="/admin/products/new" className="btn btn-secondary">
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isLowStock = p.currentStock <= p.reorderLevel;
                return (
                  <tr key={p._id} className={isLowStock ? "row-warning" : ""}>
                    <td className="font-mono">{p.sku}</td>
                    <td>
                      <Link to={`/products/${p._id}`} className="table-link">
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.category}</td>
                    <td>₹{Number(p.costPrice).toFixed(2)}</td>
                    <td>₹{Number(p.sellingPrice).toFixed(2)}</td>
                    <td>
                      <strong>
                        {p.currentStock} {p.unit}
                      </strong>
                    </td>
                    <td>
                      {p.reorderLevel} {p.unit}
                    </td>
                    <td>
                      {isLowStock ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Adequate</span>
                      )}
                    </td>
                    <td className="action-cell">
                      <Link to={`/products/${p._id}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                      {user.role === "admin" && (
                        <>
                          <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-secondary">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
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

export default Products;
