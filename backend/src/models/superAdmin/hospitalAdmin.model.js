import { db } from '../../../utils/firebase.js';
import bcrypt from 'bcrypt';

export class HospitalAdmin {
  constructor(data) {
    this.id = data.id || null;
    this.email = data.email;
    this.password = data.password;
    this.hospitalId = data.hospitalId;
    this.role = 'admin';
    this.status = data.status || 'active'; // active, inactive
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(adminData) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const { id, ...rest } = adminData;
    const admin = new HospitalAdmin({ ...rest, password: hashedPassword });
    const { id: _id, ...adminFields } = { ...admin };
    const docRef = await db().collection('hospitalAdmins').add({
      ...adminFields,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...adminFields };
  }

  static async getAll() {
    const snapshot = await db().collection('hospitalAdmins').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id, docId: doc.id };
    });
  }

  static async getByHospital(hospitalId) {
    const snapshot = await db().collection('hospitalAdmins')
      .where('hospitalId', '==', hospitalId)
      .get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, docId: doc.id }));
  }

  static async getById(id) {
    const doc = await db().collection('hospitalAdmins').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id, docId: doc.id } : null;
  }

  static async getByEmail(email) {
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id, docId: doc.id };
  }

  static async update(id, updates) {
    await db().collection('hospitalAdmins').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  static async resetPassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.update(id, { password: hashedPassword });
  }

  static async trackActivity(id) {
    return this.update(id, { lastLogin: new Date() });
  }

  static async delete(id) {
    await db().collection('hospitalAdmins').doc(id).delete();
    return true;
  }
}