import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { fetchProductById, updateProduct } from "../api/productApi";

function EditProduct({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductById(id, user.token);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, user.token]);

  const handleUpdate = async (formData) => {
    try {
      setError("");
      setSaving(true);
      await updateProduct(
        id,
        {
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          costPrice: Number(formData.costPrice),
          sellingPrice: Number(formData.sellingPrice),
          reorderLevel: Number(formData.reorderLevel),
        },
        user.token
      );
      navigate(`/products/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <Link to={`/products/${id}`} className="breadcrumb-link">
            &larr; Back to Details
          </Link>
          <h2>Edit Product: {product ? product.name : ""}</h2>
          <p className="page-subtitle">Update pricing, category, and reorder levels</p>
        </div>

        <ProductForm
          initialData={product}
          onSubmit={handleUpdate}
          isEdit={true}
          error={error}
          loading={saving}
        />
      </div>
    </div>
  );
}

export default EditProduct;
