import api from "./api";

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data?.settings || res.data;
};

export const updateSettings = async (formData) => {
  const res = await api.put("/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

