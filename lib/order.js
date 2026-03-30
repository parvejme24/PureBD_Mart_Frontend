import api from "./api";

// ============ USER ROUTES (Require Authentication) ============

// Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get user's orders
export const getUserOrders = async (params = {}) => {
  const { page = 1, limit = 10, status } = params;
  const queryParams = new URLSearchParams({ page, limit });
  if (status) queryParams.append('status', status);

  const response = await api.get(`/orders?${queryParams}`);
  return response.data;
};

// Get single order details (user's own order)
export const getUserOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Cancel order (user can cancel if order is still pending)
export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};

// ============ ADMIN ROUTES (Require Admin) ============

// Get all active orders (admin only)
export const getAllOrders = async (params = {}) => {
  const { page = 1, limit = 20, status, paymentStatus, paymentMethod } = params;
  const queryParams = new URLSearchParams({ page, limit });
  if (status) queryParams.append('status', status);
  if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
  if (paymentMethod) queryParams.append('paymentMethod', paymentMethod);

  const response = await api.get(`/orders/admin/all?${queryParams}`);
  return response.data;
};

// Get trashed orders (admin only)
export const getTrashedOrders = async (params = {}) => {
  const { page = 1, limit = 20 } = params;
  const queryParams = new URLSearchParams({ page, limit });

  const response = await api.get(`/orders/admin/trash?${queryParams}`);
  return response.data;
};

// Search orders by customer email or phone (admin only)
export const searchOrdersByCustomer = async (params = {}) => {
  const { email, phone, page = 1, limit = 20 } = params;
  const queryParams = new URLSearchParams({ page, limit });
  if (email) queryParams.append('email', email);
  if (phone) queryParams.append('phone', phone);

  const response = await api.get(`/orders/admin/search?${queryParams}`);
  return response.data;
};

// Update order status and/or payment status (admin only)
export const updateOrderStatus = async (orderId, updateData) => {
  const response = await api.put(`/orders/${orderId}/status`, updateData);
  return response.data;
};

// Move order to trash (soft delete - admin only)
export const moveOrderToTrash = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/trash`);
  return response.data;
};

// Restore order from trash (admin only)
export const restoreOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/restore`);
  return response.data;
};

// Permanently delete order from trash (admin only - dangerous operation)
export const permanentlyDeleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};

// ============ LEGACY FUNCTIONS (for backward compatibility) ============

// Get single order by ID (kept for backward compatibility, but use getUserOrderById or admin functions)
export const getOrderById = getUserOrderById;

// Delete order (legacy - now uses permanentlyDeleteOrder)
export const deleteOrder = permanentlyDeleteOrder;





















