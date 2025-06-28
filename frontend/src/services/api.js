import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const signup = async (
  username,
  password,
  first_name,
  last_name,
  mobile
) => {
  try {
    const res = await api.post('signup/', {
      username,
      password,
      first_name,
      last_name,
      mobile,
    });
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

// Route finding API
export const getRoute = async (params) => {
  try {
    const res = await api.post('route/', params);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Location API
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

export const getLocationDetails = async (id, token) => {
  try {
    const config = token
      ? { headers: { Authorization: `Token ${token}` } }
      : {};
    const res = await api.get(`locations/${id}/`, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Profile API
export const getProfile = async (username, token) => {
  try {
    const res = await api.get(
      `profile/${username}/`,
      token ? { headers: { Authorization: `Token ${token}` } } : {}
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyProfile = async (token) => {
  try {
    const res = await api.get('profile/me/', {
      headers: { Authorization: `Token ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMyProfile = async (token, { district, about_me, photo }) => {
  const formData = new FormData();
  if (district !== undefined) formData.append('district', district);
  if (about_me !== undefined) formData.append('about_me', about_me);
  if (photo) formData.append('photo', photo);
  try {
    const res = await api.patch('profile/me/', formData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Rating API
export const rateLocation = async (locationId, value, token) => {
  return api.post(
    'rating/',
    { location: locationId, value },
    { headers: { Authorization: `Token ${token}` } }
  );
};

export const removeRating = async (locationId, token) => {
  return api.delete('rating/', {
    data: { location: locationId },
    headers: { Authorization: `Token ${token}` },
  });
};

// Travel Partner API
export const getTravelPartnerRequests = async (token) => {
  const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
  const res = await api.get('/travel-partner/requests/', config);
  return res.data;
};

export const createTravelPartnerRequest = async (data, token) => {
  const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
  const res = await api.post('/travel-partner/requests/', data, config);
  return res.data;
};

export const getTravelPartnerRequestDetail = async (id, token) => {
  const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
  const res = await api.get(`/travel-partner/requests/${id}/`, config);
  return res.data;
};

export const addTravelPartnerComment = async (id, text, token) => {
  const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
  const res = await api.post(
    `/travel-partner/requests/${id}/add_comment/`,
    { text },
    config
  );
  return res.data;
};

export const updateTravelPartnerRequest = async (id, data, token) => {
  const res = await api.patch(`/travel-partner/requests/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return res.data;
};

export const deleteTravelPartnerRequest = async (id, token) => {
  await api.delete(`/travel-partner/requests/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

export const updateTravelPartnerComment = async (id, data, token) => {
  const res = await api.patch(`/travel-partner/comments/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return res.data;
};

export const deleteTravelPartnerComment = async (id, token) => {
  await api.delete(`/travel-partner/comments/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
