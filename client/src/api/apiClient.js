import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // baseURL จากโค้ดเดิมของคุณ
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;