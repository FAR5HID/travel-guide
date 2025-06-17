import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (username, password) => {
  return api.post('signup/', { username, password }).then(res => res.data);
};

export const login = async (username, password) => {
  return api.post('login/', { username, password }).then(res => res.data);
};

export const logout = async (token) => {
  return api.post('logout/', {}, {
    headers: { Authorization: `Token ${token}` }
  });
};

export const getRoute = async (params, token) => {
  return api.post('route/', params, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  }).then(res => res.data);
};
