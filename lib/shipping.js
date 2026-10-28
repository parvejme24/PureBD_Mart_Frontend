// import api from "./api";

// Public: fetch divisions/districts/upazilas
export const getShippingLocations = async () => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const res = await api.get("/shipping/locations");
  return res.data;
  // -----------------------------------------------------------
  */
  return null;
};

// Public: fetch current shipping config (fees, free-delivery flags)
export const getShippingConfig = async () => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const res = await api.get("/shipping/config");
  return res.data;
  // -----------------------------------------------------------
  */

  // Default Bangladesh shipping configuration
  return {
    shippingInsideDhaka: 60,
    shippingOutsideDhaka: 120,
    freeDeliveryThreshold: 500,
    freeDeliveryEnabled: false,
    freeDeliveryNote: "Free delivery applies on orders above ৳500!",
  };
};
