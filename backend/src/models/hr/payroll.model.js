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

  static async getByEmployee(employeeId, month, year) {
    let query = db().collection('hr_payroll').where('employeeId', '==', employeeId);
    if (month) query = query.where('month', '==', month);
    if (year) query = query.where('year', '==', year);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByOrganization(organizationId, month, year) {
    const snapshot = await db().collection('hr_payroll')
      .where('organizationId', '==', organizationId)
      .where('month', '==', month)
      .where('year', '==', year)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_payroll').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static calculateNetSalary(baseSalary, allowances = 0, overtime = 0, tax = 0, deductions = 0) {
    return baseSalary + allowances + overtime - tax - deductions;
  }
}
