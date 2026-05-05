import { db } from '../../../utils/firebase.js';

export class Attendance {
  static async create(data) {
    const docRef = await db().collection('hr_attendance').add({
      ...data,
      createdAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getByEmployee(employeeId, startDate, endDate) {
    let query = db().collection('hr_attendance').where('employeeId', '==', employeeId);
    if (startDate) query = query.where('date', '>=', startDate);
    if (endDate) query = query.where('date', '<=', endDate);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByDate(organizationId, date) {
    const snapshot = await db().collection('hr_attendance')
      .where('organizationId', '==', organizationId)
      .where('date', '==', date)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    await db().collection('hr_attendance').doc(id).update(data);
    const doc = await db().collection('hr_attendance').doc(id).get();
    return { id: doc.id, ...doc.data() };
  }
}
