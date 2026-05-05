import { Employee } from '../../models/hr/employee.model.js';
import { Attendance } from '../../models/hr/attendance.model.js';
import { Leave } from '../../models/hr/leave.model.js';
import { Contract } from '../../models/hr/contract.model.js';
import { Payroll } from '../../models/hr/payroll.model.js';

export const getDashboard = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [employees, todayAttendance, pendingLeaves, expiringContracts, monthlyPayroll] = await Promise.all([
      Employee.getAll(organizationId),
      Attendance.getByDate(organizationId, today),
      Leave.getPending(organizationId),
      Contract.getExpiring(organizationId, 30),
      Payroll.getByOrganization(organizationId, currentMonth, currentYear)
    ]);

    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const lateCheckIns = todayAttendance.filter(a => a.isLate).length;
    const onLeave = todayAttendance.filter(a => a.status === 'leave').length;
    const totalPayroll = monthlyPayroll.reduce((sum, p) => sum + p.netSalary, 0);

    res.json({
      totalEmployees: employees.length,
      presentToday,
      onLeave,
      lateCheckIns,
      payrollThisMonth: totalPayroll,
      pendingLeaveRequests: pendingLeaves.length,
      expiringContracts: expiringContracts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
