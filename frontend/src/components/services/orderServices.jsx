// src/services/orderService.js
import api from "../../api/api";

/**
 * Fetch all styles
 */
const fetchStyles = async () => {
  const res = await api.get("/styles/"); // match your backend endpoint
  return res.data?.data || res.data || [];
};

/**
 * Create a new order
 * @param {Object} orderData
 */
const createOrder = async (orderData) => {
  const res = await api.post("/orders/", orderData); // match your backend endpoint
  return res.data;
};

const orderService = {
  fetchStyles,
  createOrder,
};

export default orderService;
