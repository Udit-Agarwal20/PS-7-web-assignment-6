const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function recordStockIn(payload, token) {
  const response = await fetch(`${API_URL}/stock/in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to record Stock IN");
  }
  return data;
}

export async function recordStockOut(payload, token) {
  const response = await fetch(`${API_URL}/stock/out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to record Stock OUT");
  }
  return data;
}

export async function fetchProductMovements(productId, token) {
  const response = await fetch(`${API_URL}/stock/movements/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load movement history");
  }
  return data.movements || [];
}

export async function fetchLowStockProducts(token) {
  const response = await fetch(`${API_URL}/stock/low-stock`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load low-stock products");
  }
  return data.products || [];
}
