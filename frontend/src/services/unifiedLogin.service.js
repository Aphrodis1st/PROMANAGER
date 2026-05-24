import axios from 'axios';
import { API_BASE_URL } from '../constants/api.js';

export async function unifiedLogin(email, password) {
  const res = await axios.post(`${API_BASE_URL}/auth/unified-login`, { email, password });
  return res.data;
}
