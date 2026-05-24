import axios from 'axios';
import { API_BASE_URL } from '../constants/api.js';

export async function registerService(formData) {
  const res = await axios.post(`${API_BASE_URL}/service-registration/register`, formData);
  return res.data;
}
