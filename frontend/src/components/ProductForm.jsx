import React, { useState, useEffect } from "react";

function ProductForm({ initialData, onSubmit, isEdit, error, loading }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    unit: "pcs",
    costPrice: "",
    sellingPrice: "",
    openingStock: "",
    reorderLevel: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || "",
        name: initialData.name || "",
        category: initialData.category || "",
        unit: initialData.unit || "pcs",
        costPrice: initialData.costPrice !== undefined ? initialData.costPrice : "",
        sellingPrice: initialData.sellingPrice !== undefined ? initialData.sellingPrice : "",
        openingStock: initialData.openingStock !== undefined ? initialData.openingStock : "",
        reorderLevel: initialData.reorderLevel !== undefined ? initialData.reorderLevel : 5,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="sku">SKU Code</label>
        <input
          id="sku"
          name="sku"
          type="text"
          value={formData.sku}
          onChange={handleChange}
          required
          disabled={isEdit}
          placeholder="e.g. NB-CLASSIC"
        />
        {isEdit && <small className="form-hint">SKU cannot be changed after creation.</small>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Classic Ruled Notebook"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g. Stationery"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Unit</label>
          <input
            id="unit"
            name="unit"
            type="text"
            value={formData.unit}
            onChange={handleChange}
            required
            placeholder="e.g. pcs, pack, box"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="costPrice">Cost Price (₹)</label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="any"
            value={formData.costPrice}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sellingPrice">Selling Price (₹)</label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="any"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="openingStock">Opening Stock</label>
          <input
            id="openingStock"
            name="openingStock"
            type="number"
            min="0"
            step="1"
            value={formData.openingStock}
            onChange={handleChange}
            required={!isEdit}
            disabled={isEdit}
            placeholder="0"
          />
          {isEdit && (
            <small className="form-hint">
              Stock cannot be modified via product edit. Use Stock IN/OUT transactions.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reorderLevel">Reorder Level</label>
          <input
            id="reorderLevel"
            name="reorderLevel"
            type="number"
            min="0"
            step="1"
            value={formData.reorderLevel}
            onChange={handleChange}
            required
            placeholder="5"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
