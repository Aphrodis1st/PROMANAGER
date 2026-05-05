import { Payroll } from '../../models/hr/payroll.model.js';
import { Employee } from '../../models/hr/employee.model.js';

export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, allowances, overtime, tax, deductions } = req.body;
    const employee = await Employee.getById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const netSalary = Payroll.calculateNetSalary(
      employee.baseSalary,
      allowances,
      overtime,
      tax,
      deductions
    );

    const payroll = await Payroll.create({
      employeeId,
      organizationId: employee.organizationId,
      month,
      year,
      baseSalary: employee.baseSalary,
      allowances,
      overtime,
      tax,
      deductions,
      netSalary
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    const payroll = await Payroll.getByEmployee(employeeId, month, year);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganizationPayroll = async (req, res) => {
  try {
    const { organizationId, month, year } = req.query;
    const payroll = await Payroll.getByOrganization(organizationId, month, year);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayslip = async (req, res) => {
  try {
    const payslip = await Payroll.getById(req.params.id);
    if (!payslip) return res.status(404).json({ error: 'Payslip not found' });
    res.json(payslip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
