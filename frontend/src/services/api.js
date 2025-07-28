import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await api.get('/api/posts', {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('API Raw Response:', response);
    if (typeof response.data === 'string') {
      console.error('Received HTML instead of JSON:', response.data);
      return [];
    }
    return response.data.posts || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error.response?.data || error.message;
  }
};

export const getPost = async (id) => {
  try {
    const response = await api.get(`/api/posts/${id}`);
    return response.data.post;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/api/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/reset', { token, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
