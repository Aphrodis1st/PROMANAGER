import { Payroll } from '../../models/hr/payroll.model.js';
import { Employee } from '../../models/hr/employee.model.js';

export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, allowances, overtime, tax, deductions } = req.body;
    const employee = await Employee.getById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Check if payroll already exists for this employee and period
    const existingPayroll = await Payroll.getByEmployeeAndPeriod(employeeId, month, year);
    if (existingPayroll) {
      return res.status(400).json({ error: 'Payroll already exists for this period' });
    }

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
      allowances: allowances || 0,
      overtime: overtime || 0,
      tax: tax || 0,
      deductions: deductions || 0,
      netSalary,
      status: 'generated',
      generatedBy: req.user?.id,
      generatedAt: new Date()
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkGeneratePayroll = async (req, res) => {
  try {
    const { organizationId, month, year, defaultTaxRate = 0.1 } = req.body;
    const employees = await Employee.getByOrganization(organizationId);
    
    const payrolls = [];
    const errors = [];

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await Payroll.getByEmployeeAndPeriod(employee.id, month, year);
        if (existingPayroll) {
          errors.push(`Payroll already exists for employee ${employee.id}`);
          continue;
        }

        const tax = employee.baseSalary * defaultTaxRate;
        const netSalary = Payroll.calculateNetSalary(employee.baseSalary, 0, 0, tax, 0);

        const payroll = await Payroll.create({
          employeeId: employee.id,
          organizationId,
          month,
          year,
          baseSalary: employee.baseSalary,
          allowances: 0,
          overtime: 0,
          tax,
          deductions: 0,
          netSalary,
          status: 'generated',
          generatedBy: req.user?.id,
          generatedAt: new Date()
        });

        payrolls.push(payroll);
      } catch (error) {
        errors.push(`Error generating payroll for employee ${employee.id}: ${error.message}`);
      }
    }

    res.status(201).json({
      success: true,
      generated: payrolls.length,
      errors: errors.length,
      payrolls,
      errorMessages: errors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { allowances, overtime, tax, deductions } = req.body;
    
    const payroll = await Payroll.getById(id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });

    const netSalary = Payroll.calculateNetSalary(
      payroll.baseSalary,
      allowances || payroll.allowances,
      overtime || payroll.overtime,
      tax || payroll.tax,
      deductions || payroll.deductions
    );

    const updatedPayroll = await Payroll.update(id, {
      allowances: allowances || payroll.allowances,
      overtime: overtime || payroll.overtime,
      tax: tax || payroll.tax,
      deductions: deductions || payroll.deductions,
      netSalary,
      updatedAt: new Date(),
      updatedBy: req.user?.id
    });

    res.json(updatedPayroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.getById(id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });

    await Payroll.delete(id);
    res.json({ message: 'Payroll deleted successfully' });
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

export const getPayrollStats = async (req, res) => {
  try {
    const { organizationId, month, year } = req.query;
    const stats = await Payroll.getStats(organizationId, month, year);
    res.json(stats);
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

export const approvePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.getById(id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });

    const updatedPayroll = await Payroll.update(id, {
      status: 'approved',
      approvedBy: req.user?.id,
      approvedAt: new Date()
    });

    res.json(updatedPayroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const processPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.getById(id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });

    if (payroll.status !== 'approved') {
      return res.status(400).json({ error: 'Payroll must be approved before processing' });
    }

    const updatedPayroll = await Payroll.update(id, {
      status: 'processed',
      processedBy: req.user?.id,
      processedAt: new Date()
    });

    res.json(updatedPayroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
