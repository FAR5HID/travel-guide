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

export const updateMyProfile = async (
  token,
  { first_name, last_name, mobile, district, about_me, photo }
) => {
  const formData = new FormData();
  if (first_name !== undefined) formData.append('first_name', first_name);
  if (last_name !== undefined) formData.append('last_name', last_name);
  if (mobile !== undefined) formData.append('mobile', mobile);
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

// Visual Crossing Weather API
export const getWeatherForecast = async (district, startDate, endDate) => {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  let start = startDate;
  let end = endDate;
  if (!start || !end) {
    // Default: next 7 days
    const today = new Date();
    start = today.toISOString().slice(0, 10);
    const future = new Date(today);
    future.setDate(today.getDate() + 6);
    end = future.toISOString().slice(0, 10);
  }
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    district
  )}/${start}/${end}?unitGroup=metric&key=${apiKey}&contentType=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  const data = await res.json();
  return data.days || [];
};

// Calendarific Holidays API
export const getBangladeshHolidaysInRange = async (startDate, endDate) => {
  const apiKey = process.env.REACT_APP_CALENDARIFIC_KEY;
  if (!apiKey) throw new Error('Calendarific API key not set');
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) return [];

  const ymSet = new Set([
    `${start.getFullYear()}-${start.getMonth() + 1}`,
    `${end.getFullYear()}-${end.getMonth() + 1}`,
  ]);
  const ymArr = Array.from(ymSet).map((ym) => {
    const [year, month] = ym.split('-');
    return { year: Number(year), month: Number(month) };
  });

  let holidays = [];
  for (const { year, month } of ymArr) {
    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=BD&year=${year}&month=${month}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.response && Array.isArray(data.response.holidays)) {
        holidays = holidays.concat(data.response.holidays);
      }
    } catch (e) {
      // ignore errors for individual months
    }
  }

  // Filter holidays within the range
  return holidays.filter((h) => {
    const date = new Date(h.date.iso);
    return date >= start && date <= end;
  });
};
