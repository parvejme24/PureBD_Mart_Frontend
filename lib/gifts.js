import api from "./api";

export const getGifts = async () => {
  const res = await api.get("/gifts");
  return res.data?.gifts || res.data;
};

export const createGift = async (payload) => {
  const res = await api.post("/gifts", payload);
  return res.data;
};













