import { Hospital } from '../../models/superAdmin/hospital.model.js';
import { HospitalAdmin } from '../../models/superAdmin/hospitalAdmin.model.js';
import { Stock } from '../../models/superAdmin/stock.model.js';
import { Pharmacy } from '../../models/superAdmin/pharmacy.model.js';
import { HROrganization } from '../../models/superAdmin/hrOrganization.model.js';
import { db } from '../../../utils/firebase.js';

export const getDashboardStats = async (req, res) => {
  try {
    const hospitals = await Hospital.getAll();
    const admins = await HospitalAdmin.getAll();
    const stocks = await Stock.getAll();
    const pharmacies = await Pharmacy.getAll();
    const hrOrganizations = await HROrganization.getAll();
    
    const stats = {
      totalHospitals: hospitals.length,
      activeHospitals: hospitals.filter(h => h.status === 'active').length,
      suspendedHospitals: hospitals.filter(h => h.status === 'suspended').length,
      totalAdmins: admins.length,
      activeAdmins: admins.filter(a => a.status === 'active').length,
      inactiveAdmins: admins.filter(a => a.status === 'inactive').length,
      totalStocks: stocks.length,
      activeStocks: stocks.filter(s => s.status === 'active').length,
      suspendedStocks: stocks.filter(s => s.status === 'suspended').length,
      totalPharmacies: pharmacies.length,
      activePharmacies: pharmacies.filter(p => p.status === 'active').length,
      suspendedPharmacies: pharmacies.filter(p => p.status === 'suspended').length,
      totalHROrganizations: hrOrganizations.length,
      activeHROrganizations: hrOrganizations.filter(h => h.status === 'active').length,
      suspendedHROrganizations: hrOrganizations.filter(h => h.status === 'suspended').length,
      subscriptionPlans: {
        basic: hospitals.filter(h => h.subscriptionPlan === 'basic').length,
        premium: hospitals.filter(h => h.subscriptionPlan === 'premium').length,
        enterprise: hospitals.filter(h => h.subscriptionPlan === 'enterprise').length
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSystemActivity = async (req, res) => {
  try {
    // Get recent activities from different collections
    const recentHospitals = await db().collection('hospitals')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    const recentAdmins = await db().collection('hospitalAdmins')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const activities = [
      ...recentHospitals.docs.map(doc => ({
        type: 'hospital_created',
        data: doc.data(),
        timestamp: doc.data().createdAt
      })),
      ...recentAdmins.docs.map(doc => ({
        type: 'admin_login',
        data: doc.data(),
        timestamp: doc.data().lastLogin
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    const settings = {
      availableFeatures: [
        'appointments',
        'billing',
        'lab',
        'pharmacy',
        'medical_records',
        'vital_signs',
        'prescriptions',
        'surgery_records',
        'treatment_plans',
        'admissions'
      ],
      subscriptionPlans: [
        { name: 'basic', features: ['appointments', 'billing', 'medical_records'] },
        { name: 'premium', features: ['appointments', 'billing', 'lab', 'pharmacy', 'medical_records', 'vital_signs'] },
        { name: 'enterprise', features: ['appointments', 'billing', 'lab', 'pharmacy', 'medical_records', 'vital_signs', 'prescriptions', 'surgery_records', 'treatment_plans', 'admissions'] }
      ]
    };

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};