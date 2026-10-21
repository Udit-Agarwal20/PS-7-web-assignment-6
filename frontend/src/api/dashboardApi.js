const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function fetchDashboardStats(token) {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard metrics");
  }
  return data.stats;
}
