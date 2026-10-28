// import api from "./api";

// ============ USER ROUTES ============

// Create a new order (with local fallback and API toggle)
export const createOrder = async (orderData) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.post("/orders", orderData);
  return response.data;
  // -----------------------------------------------------------
  */

  // Local order creation for client-side demo & offline mode
  const generatedOrderId = `PBM-${Date.now().toString().slice(-6)}`;
  const orderRecord = {
    _id: `ord_${Date.now()}`,
    orderId: generatedOrderId,
    ...orderData,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("pbm_orders") || "[]");
      existing.unshift(orderRecord);
      localStorage.setItem("pbm_orders", JSON.stringify(existing));
      sessionStorage.setItem("lastOrder", JSON.stringify(orderRecord));
    } catch (e) {
      console.warn("Storage access issue:", e);
    }
  }

  return {
    success: true,
    message: "Order placed successfully!",
    order: orderRecord,
  };
};

// Get user's orders
export const getUserOrders = async (params = {}) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const { page = 1, limit = 10, status } = params;
  const queryParams = new URLSearchParams({ page, limit });
  if (status) queryParams.append('status', status);

  const response = await api.get(`/orders?${queryParams}`);
  return response.data;
  // -----------------------------------------------------------
  */

  if (typeof window !== "undefined") {
    const list = JSON.parse(localStorage.getItem("pbm_orders") || "[]");
    return { orders: list, total: list.length };
  }
  return { orders: [], total: 0 };
};

// Get single order details (user's own order)
export const getUserOrderById = async (orderId) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
  // -----------------------------------------------------------
  */

  if (typeof window !== "undefined") {
    const list = JSON.parse(localStorage.getItem("pbm_orders") || "[]");
    const found = list.find((o) => o.orderId === orderId || o._id === orderId);
    return { order: found || list[0] || null };
  }
  return { order: null };
};

// Cancel order (user can cancel if order is still pending)
export const cancelOrder = async (orderId) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
  // -----------------------------------------------------------
  */

  if (typeof window !== "undefined") {
    const list = JSON.parse(localStorage.getItem("pbm_orders") || "[]");
    const idx = list.findIndex((o) => o.orderId === orderId || o._id === orderId);
    if (idx !== -1) {
      list[idx].status = "cancelled";
      localStorage.setItem("pbm_orders", JSON.stringify(list));
    }
  }
  return { success: true, message: "Order cancelled successfully" };
};

// ============ ADMIN ROUTES ============

export const getAllOrders = async (params = {}) => {
  if (typeof window !== "undefined") {
    const list = JSON.parse(localStorage.getItem("pbm_orders") || "[]");
    return { orders: list, total: list.length };
  }
  return { orders: [], total: 0 };
};

export const getTrashedOrders = async (params = {}) => {
  return { orders: [], total: 0 };
};

export const searchOrdersByCustomer = async (params = {}) => {
  return { orders: [], total: 0 };
};

export const updateOrderStatus = async ({ orderId, status }) => {
  return { success: true };
};

export const moveOrderToTrash = async (orderId) => {
  return { success: true };
};

export const restoreOrder = async (orderId) => {
  return { success: true };
};

export const permanentlyDeleteOrder = async (orderId) => {
  return { success: true };
};
