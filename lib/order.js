import api from "./api";

// Create a new order (public)
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Get single order by ID (admin only)
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Update order status (admin only)
export const updateOrderStatus = async ({ id, status }) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

// Delete order (admin only)
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};



