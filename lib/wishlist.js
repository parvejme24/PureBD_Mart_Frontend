import api, { API_BASE_URL } from "./api";

// Get user's wishlist
export const getUserWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Clear entire wishlist
export const clearWishlist = async () => {
  const response = await api.delete("/wishlist");
  return response.data;
};

// Check if product is in wishlist (helper function)
export const isProductInWishlist = async (productId) => {
  try {
    const { wishlist } = await getUserWishlist();
    return wishlist.some(product => product._id === productId);
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
};