import api from "./api";

export const getWaste = async () => {
  const res = await api.get("/waste");
  return res.data?.waste || res.data;
};

export const createWaste = async (payload) => {
  const res = await api.post("/waste", payload);
  return res.data;
};








