import api from "./api";

// Initialize payment with ShurjoPay
export const initPayment = async (orderData) => {
  try {
    console.log("Initializing payment with data:", orderData);
    const response = await api.post("/payment/init", orderData);
    console.log("Payment init response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment init API error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Verify payment status
export const verifyPayment = async (orderId) => {
  const response = await api.post("/payment/verify", { order_id: orderId });
  return response.data;
};

// Check payment status by transaction ID
export const checkPaymentStatus = async (transactionId) => {
  const response = await api.get(`/payment/status/${transactionId}`);
  return response.data;
};

// Get all transactions (admin only)
export const getAllTransactions = async (params = {}) => {
  const { status, startDate, endDate, page = 1, limit = 20 } = params;
  
  let url = `/payment/transactions?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  
  const response = await api.get(url);
  return response.data;
};

