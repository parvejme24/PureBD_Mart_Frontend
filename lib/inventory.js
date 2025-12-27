import api from "./api";

export const getPurchases = async (params = {}) => {
  const res = await api.get("/inventory/purchases", { params });
  return res.data?.purchases || res.data;
};

export const createPurchase = async (payload) => {
  const res = await api.post("/inventory/purchases", payload);
  return res.data;
};

export const getStockSummary = async () => {
  const res = await api.get("/inventory/stock-summary");
  return res.data?.summary || res.data;
};

export const getRecentPurchases = async (limit = 10) => {
  const res = await api.get("/inventory/purchases/recent", { params: { limit } });
  return res.data?.purchases || res.data;
};

export const getPurchaseReturns = async () => {
  const res = await api.get("/inventory/purchase-returns");
  return res.data?.returns || res.data;
};

export const createPurchaseReturn = async (payload) => {
  const res = await api.post("/inventory/purchase-returns", payload);
  return res.data;
};

export const updatePurchaseReturn = async ({ id, ...payload }) => {
  const res = await api.put(`/inventory/purchase-returns/${id}`, payload);
  return res.data;
};

export const deletePurchaseReturn = async (id) => {
  const res = await api.delete(`/inventory/purchase-returns/${id}`);
  return res.data;
};

export const updatePurchase = async ({ id, ...payload }) => {
  const res = await api.put(`/inventory/purchases/${id}`, payload);
  return res.data;
};

export const deletePurchase = async (id) => {
  const res = await api.delete(`/inventory/purchases/${id}`);
  return res.data;
};

export const getLowStockProducts = async () => {
  const res = await api.get("/inventory/low-stock");
  return res.data?.products || res.data;
};

export const updateLowStockConfig = async ({ productId, ...payload }) => {
  const res = await api.patch(`/inventory/low-stock/${productId}`, payload);
  return res.data;
};

export const getExpiryAlerts = async (params = {}) => {
  const res = await api.get("/inventory/expiry-alerts", { params });
  return res.data?.alerts || res.data;
};


