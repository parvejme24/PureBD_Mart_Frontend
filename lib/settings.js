import api from "./api";

export const getSettings = async () => {
  try {
    const res = await api.get("/settings");
    return res.data?.settings || res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Settings endpoint not implemented, return default settings
      console.warn("Settings endpoint not available, using defaults");
      return {
        siteTitle: "PureBD Mart - Your Trusted Online Marketplace",
        siteDescription: "Shop the best products at PureBD Mart",
        siteFavicon: { url: "/favicon.ico" }
      };
    }
    throw error;
  }
};

export const updateSettings = async (formData) => {
  try {
    const res = await api.put("/settings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Settings endpoint not implemented
      throw new Error("Settings management is not available at this time");
    }
    throw error;
  }
};

