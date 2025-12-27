import api from "./api";

export const getExpenses = async () => {
  const res = await api.get("/expenses");
  return res.data;
};

export const createExpense = async (payload) => {
  const res = await api.post("/expenses", payload);
  return res.data;
};








