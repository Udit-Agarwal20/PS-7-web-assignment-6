const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function fetchSuppliers(token) {
  const response = await fetch(`${API_URL}/suppliers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load suppliers");
  }
  return data.suppliers || [];
}

export async function createSupplier(supplierData, token) {
  const response = await fetch(`${API_URL}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create supplier");
  }
  return data;
}

export async function updateSupplier(id, supplierData, token) {
  const response = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update supplier");
  }
  return data;
}

export async function deleteSupplier(id, token) {
  const response = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete supplier");
  }
  return data;
}
