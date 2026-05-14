import { db } from '../../../utils/firebase.js';

export class Payroll {
  static async create(data) {
    const docRef = await db().collection('hr_payroll').add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async update(id, data) {
    await db().collection('hr_payroll').doc(id).update({
      ...data,
      updatedAt: new Date()
    });
    return { id, ...data };
  }

  static async delete(id) {
    await db().collection('hr_payroll').doc(id).delete();
    return true;
  }

  static async getByEmployee(employeeId, month, year) {
    let query = db().collection('hr_payroll').where('employeeId', '==', employeeId);
    if (month) query = query.where('month', '==', month);
    if (year) query = query.where('year', '==', year);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByEmployeeAndPeriod(employeeId, month, year) {
    const snapshot = await db().collection('hr_payroll')
      .where('employeeId', '==', employeeId)
      .where('month', '==', month)
      .where('year', '==', year)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async getByOrganization(organizationId, month, year) {
    let query = db().collection('hr_payroll')
      .where('organizationId', '==', organizationId);
    
    if (month) query = query.where('month', '==', month);
    if (year) query = query.where('year', '==', year);
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_payroll').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async getStats(organizationId, month, year) {
    const payrolls = await this.getByOrganization(organizationId, month, year);
    
    const totalEmployees = payrolls.length;
    const totalSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const totalBaseSalary = payrolls.reduce((sum, p) => sum + (p.baseSalary || 0), 0);
    const totalAllowances = payrolls.reduce((sum, p) => sum + (p.allowances || 0), 0);
    const totalOvertime = payrolls.reduce((sum, p) => sum + (p.overtime || 0), 0);
    const totalTax = payrolls.reduce((sum, p) => sum + (p.tax || 0), 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + (p.deductions || 0), 0);
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    
    const statusCounts = payrolls.reduce((acc, p) => {
      acc[p.status || 'generated'] = (acc[p.status || 'generated'] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees,
      totalSalary,
      totalBaseSalary,
      totalAllowances,
      totalOvertime,
      totalTax,
      totalDeductions,
      avgSalary,
      statusCounts,
      period: { month, year }
    };
  }

  static async getPayrollHistory(employeeId, limit = 12) {
    const snapshot = await db().collection('hr_payroll')
      .where('employeeId', '==', employeeId)
      .orderBy('year', 'desc')
      .orderBy('month', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getPayrollByStatus(organizationId, status, month, year) {
    let query = db().collection('hr_payroll')
      .where('organizationId', '==', organizationId)
      .where('status', '==', status);
    
    if (month) query = query.where('month', '==', month);
    if (year) query = query.where('year', '==', year);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static calculateNetSalary(baseSalary, allowances = 0, overtime = 0, tax = 0, deductions = 0) {
    const grossSalary = baseSalary + allowances + overtime;
    const totalDeductions = tax + deductions;
    return Math.max(0, grossSalary - totalDeductions);
  }

  static calculateTax(baseSalary, taxRate = 0.1) {
    return baseSalary * taxRate;
  }

  static calculateOvertime(hourlyRate, overtimeHours, overtimeMultiplier = 1.5) {
    return hourlyRate * overtimeHours * overtimeMultiplier;
  }

  static validatePayrollData(data) {
    const errors = [];
    
    if (!data.employeeId) errors.push('Employee ID is required');
    if (!data.month || data.month < 1 || data.month > 12) errors.push('Valid month is required');
    if (!data.year || data.year < 2000) errors.push('Valid year is required');
    if (data.baseSalary < 0) errors.push('Base salary cannot be negative');
    if (data.allowances < 0) errors.push('Allowances cannot be negative');
    if (data.overtime < 0) errors.push('Overtime cannot be negative');
    if (data.tax < 0) errors.push('Tax cannot be negative');
    if (data.deductions < 0) errors.push('Deductions cannot be negative');
    
    return errors;
  }
}
