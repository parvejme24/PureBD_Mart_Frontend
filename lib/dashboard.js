import api from "./api";

// Get dashboard stats (total users, orders, products, revenue)
export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

// Get revenue overview by year
export const getRevenueOverview = async (year) => {
  const response = await api.get(`/dashboard/revenue-overview${year ? `?year=${year}` : ''}`);
  return response.data;
};

// Get product performance
export const getProductPerformance = async (startDate, endDate) => {
  let url = "/dashboard/product-performance";
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await api.get(url);
  return response.data;
};

// Get category performance
export const getCategoryPerformance = async (startDate, endDate) => {
  let url = "/dashboard/category-performance";
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await api.get(url);
  return response.data;
};

// Increment product view
export const incrementProductView = async (productId) => {
  const response = await api.post(`/dashboard/product-view/${productId}`);
  return response.data;
};

