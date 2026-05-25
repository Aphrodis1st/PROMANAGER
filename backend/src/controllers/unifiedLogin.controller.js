import { unifiedLogin } from '../services/unifiedLogin.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await unifiedLogin(email, password);
    res.json(result);
  } catch (err) {
    const status = err.status || 500;
  if (status === 500) console.error('Unified login error:', err.message);
    res.status(status).json({
      success: false,
      message: err.message || 'Login failed',
      error: err.message,
    });
  }
};
