import { Attendance } from '../../models/hr/attendance.model.js';

export const checkIn = async (req, res) => {
  try {
    const { employeeId, organizationId, shiftId } = req.body;
    const attendance = await Attendance.create({
      employeeId,
      organizationId,
      shiftId,
      date: new Date().toISOString().split('T')[0],
      checkIn: new Date(),
      status: 'present'
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.update(id, { checkOut: new Date() });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const attendance = await Attendance.getByEmployee(employeeId, startDate, endDate);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.getByDate(organizationId, today);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
