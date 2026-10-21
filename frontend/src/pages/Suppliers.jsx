import React, { useState, useEffect } from "react";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../api/supplierApi";

function Suppliers({ user }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({ name: "", phone: "", city: "" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchSuppliers(user.token);
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = (sup) => {
    setEditingId(sup._id);
    setFormData({ name: sup.name, phone: sup.phone, city: sup.city });
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "", city: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (editingId) {
        await updateSupplier(editingId, formData, user.token);
        setSuccess(`Supplier "${formData.name}" updated successfully.`);
      } else {
        await createSupplier(formData, user.token);
        setSuccess(`Supplier "${formData.name}" created successfully.`);
      }

      setFormData({ name: "", phone: "", city: "" });
      setEditingId(null);
      await loadSuppliers();
    } catch (err) {
      setError(err.message || "Failed to save supplier");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteSupplier(id, user.token);
      setSuccess(`Supplier "${name}" deleted successfully.`);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete supplier");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Supplier Management</h2>
          <p className="page-subtitle">Manage wholesale vendors and purchase contacts</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="suppliers-layout">
        <div className="supplier-form-card">
          <h3>{editingId ? "Edit Supplier" : "Add New Supplier"}</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="sup-name">Supplier Name</label>
              <input
                id="sup-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Apex Office Supplies"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sup-phone">Phone Number</label>
              <input
                id="sup-phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sup-city">City</label>
              <input
                id="sup-city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update Supplier" : "Add Supplier"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="supplier-list-card">
          <h3>Approved Suppliers ({suppliers.length})</h3>

          {loading ? (
            <div className="state-message">
              <div className="spinner"></div>
              <p>Loading suppliers...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="state-message empty-state">
              <p>No suppliers registered yet. Add one using the form.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td>{s.phone}</td>
                      <td>{s.city}</td>
                      <td className="action-cell">
                        <button
                          onClick={() => handleStartEdit(s)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.name)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
