import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export const userService = {
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  },

  updateProfile: async (data) => {
    const response = await axios.patch(`${API_BASE_URL}/users/me`, data, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  },

  updateProfilePicture: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/users/me/picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  },

  deleteAccount: async () => {
    const response = await axios.delete(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  },
};