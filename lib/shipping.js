import api from "./api";

// Public: fetch divisions/districts/upazilas
export const getShippingLocations = async () => {
  const res = await api.get("/shipping/locations");
  return res.data;
};

// Public: fetch current shipping config (fees, free-delivery flags)
export const getShippingConfig = async () => {
  const res = await api.get("/shipping/config");
  return res.data;
};

