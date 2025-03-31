import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const createTask = (description: string, userId: number) =>
  axiosInstance.post('', { description, userId });
