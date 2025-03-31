import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const register = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/register`, { email, password });
};

export const login = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
