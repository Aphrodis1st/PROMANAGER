import { HospitalAdmin } from '../../models/superAdmin/hospitalAdmin.model.js';

export const createHospitalAdmin = async (req, res) => {
  try {
    const admin = await HospitalAdmin.create(req.body);
    const { password, ...adminData } = admin;
    res.status(201).json({ success: true, data: adminData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllHospitalAdmins = async (req, res) => {
  try {
    const admins = await HospitalAdmin.getAll();
    const sanitizedAdmins = admins.map(({ password, ...admin }) => admin);
    res.json({ success: true, data: sanitizedAdmins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHospitalAdminsByHospital = async (req, res) => {
  try {
    const admins = await HospitalAdmin.getByHospital(req.params.hospitalId);
    const sanitizedAdmins = admins.map(({ password, ...admin }) => admin);
    res.json({ success: true, data: sanitizedAdmins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHospitalAdmin = async (req, res) => {
  try {
    const admin = await HospitalAdmin.getById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    const { password, ...adminData } = admin;
    res.json({ success: true, data: adminData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHospitalAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const admin = await HospitalAdmin.updateStatus(req.params.id, status);
    const { password, ...adminData } = admin;
    res.json({ success: true, data: adminData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetHospitalAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    await HospitalAdmin.resetPassword(req.params.id, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const trackAdminActivity = async (req, res) => {
  try {
    await HospitalAdmin.trackActivity(req.params.id);
    res.json({ success: true, message: 'Activity tracked' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteHospitalAdmin = async (req, res) => {
  try {
    await HospitalAdmin.delete(req.params.id);
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};