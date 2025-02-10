import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUserProfile = async (userId) => {
  return await axios.get(`${API_URL}/users/${userId}`);
};

export const updateUserProfile = async (userId, data) => {
  return await axios.put(`${API_URL}/users/${userId}`, data);
};
