// src/services/styleService.js
import api from "../../api/api";

export const styleService = {
  fetchStyles: async () => {
    const res = await api.get('/styles');
    return res.data.data; // array of styles
  },

  createStyle: async (stylePayload) => {
    const res = await api.post('/styles', stylePayload);
    return res.data.data;
  },

  deleteStyle: async (id) => {
    const res = await api.delete(`/styles/${id}`);
    return res.data;
  }
};

