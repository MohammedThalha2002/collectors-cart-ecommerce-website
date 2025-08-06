import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt-token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Profile services
export const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/profile`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/profile`,
      profileData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile/change-password`,
      passwordData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password" };
  }
};

// Orders services
export const getUserOrders = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/user/info`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};

// Wishlist services
export const getUserWishlist = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/profile/wishlist`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch wishlist" };
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile/wishlist`,
      { productId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to wishlist" };
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/profile/wishlist/${productId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove from wishlist" };
  }
};

export const checkWishlistStatus = async (productId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/profile/wishlist/check/${productId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to check wishlist status" }
    );
  }
};
