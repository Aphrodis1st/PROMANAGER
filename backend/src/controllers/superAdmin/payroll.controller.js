import { db } from '../../../utils/firebase.js';

export const payrollController = {
  // Get all payroll data
  async getAll(req, res) {
    try {
      const snapshot = await db().collection('payroll').orderBy('date', 'desc').get();
      const payrollData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: payrollData });
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get payroll by organization
  async getByOrganization(req, res) {
    try {
      const { organizationId } = req.params;
      const snapshot = await db()
        .collection('payroll')
        .where('organizationId', '==', organizationId)
        .orderBy('date', 'desc')
        .get();
      
      const payrollData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: payrollData });
    } catch (error) {
      console.error('Error fetching organization payroll:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get payroll statistics
  async getStats(req, res) {
    try {
      const snapshot = await db().collection('payroll').get();
      const payrollData = snapshot.docs.map(doc => doc.data());
      
      const stats = {
        totalPayroll: payrollData.reduce((sum, p) => sum + (p.amount || 0), 0),
        pendingCount: payrollData.filter(p => p.status === 'pending').length,
        processedCount: payrollData.filter(p => p.status === 'processed').length,
        totalTransactions: payrollData.length
      };
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching payroll stats:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
