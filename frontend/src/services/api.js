import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (username, password) => {
  try {
    const res = await api.post('signup/', { username, password });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (username, password) => {
  try {
    const res = await api.post('login/', { username, password });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async (token) => {
  try {
    return await api.post(
      'logout/',
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRoute = async (params) => {
  try {
    const res = await api.post('route/', params);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLocationsByCategory = async (category) => {
  try {
    const res = await api.get('locations/', {
      params: { category },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLocationDetails = async (id) => {
  try {
    const res = await api.get(`locations/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
