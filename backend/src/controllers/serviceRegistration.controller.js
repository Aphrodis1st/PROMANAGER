import { registerService } from '../services/serviceRegistration.service.js';

export const register = async (req, res) => {
  try {
    const {
      serviceId,
      fullName,
      email,
      phone,
      organizationName,
      description,
      is_manager,
      managerFullName,
      managerEmail,
      managerPhone,
      password,
    } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: 'Service is required.' });
    }
    if (!fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Your name, email, and phone are required.' });
    }
    if (!organizationName?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Organization name and description are required.' });
    }
    if (typeof is_manager !== 'boolean') {
      return res.status(400).json({ message: 'Please indicate whether you are the manager.' });
    }
    if (!is_manager) {
      if (!managerFullName?.trim() || !managerEmail?.trim() || !managerPhone?.trim()) {
        return res.status(400).json({ message: 'Manager name, email, and phone are required.' });
      }
    }

    const result = await registerService({
      serviceId,
      fullName,
      email,
      phone,
      organizationName,
      description,
      is_manager,
      managerFullName,
      managerEmail,
      managerPhone,
      password,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('[serviceRegistration] register error:', err);
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || 'Registration failed. Please try again.',
    });
  }
};
