import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productApi";

function AddProduct({ user }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      setError("");
      setLoading(true);
      await createProduct(
        {
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          costPrice: Number(formData.costPrice),
          sellingPrice: Number(formData.sellingPrice),
          openingStock: Number(formData.openingStock),
          reorderLevel: Number(formData.reorderLevel),
        },
        user.token
      );
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/products" className="breadcrumb-link">
            &larr; Back to Products
          </Link>
          <h2>Add New Product</h2>
          <p className="page-subtitle">
            Create a new retail item with opening stock and pricing
          </p>
        </div>

        <ProductForm
          onSubmit={handleCreate}
          isEdit={false}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default AddProduct;
