import axios from "axios";
import { API_BASE_URL } from '../constants/api';

const HOSPITAL_API_URL = `${API_BASE_URL}/api/v1/hospital`;
const SUPER_ADMIN_API_URL = `${API_BASE_URL}/api/v1/super-admin`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const getSuperAdminAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const getHospitalAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('hospitalToken')}` },
});


// =======================================================
// 🏥 PATIENT SERVICE
// =======================================================
export const patientService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/patients`, getHospitalAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/patients/${id}`, getHospitalAuthHeader());
    return res.data;
  },

  create: async (data) => {
    try {
      const res = await axios.post(`${HOSPITAL_API_URL}/patients`, data, getHospitalAuthHeader());
      return res.data;
    } catch (error) {
      console.error('Patient service create error:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/patients/${id}`, data, getHospitalAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/patients/${id}`, getHospitalAuthHeader());
    return res.data;
  },
};


// =======================================================
// 📅 APPOINTMENT SERVICE
// =======================================================
export const appointmentService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/appointments`, getHospitalAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/appointments`, data, getHospitalAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/appointments/${id}`, data, getHospitalAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/appointments/${id}`, getHospitalAuthHeader());
    return res.data;
  },
};


// =======================================================
// 💰 BILLING SERVICE
// =======================================================
export const billingService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/billing`, getHospitalAuthHeader());
    return res.data;
  },

  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/billing/patient/${patientId}`, getHospitalAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/billing`, data, getHospitalAuthHeader());
    return res.data;
  },

  markAsPaid: async (id) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/billing/${id}/pay`, {}, getHospitalAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/billing/${id}`, getHospitalAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🧪 LAB SERVICE
// =======================================================
export const labService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab`, getHospitalAuthHeader());
    return res.data;
  },

  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab/patient/${patientId}`, getHospitalAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/lab`, data, getHospitalAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/lab/${id}`, data, getHospitalAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/lab/${id}`, getHospitalAuthHeader());
    return res.data;
  },

  getAllOrders: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab/orders`, getHospitalAuthHeader());
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab/orders/${id}`, getHospitalAuthHeader());
    return res.data;
  },

  createOrder: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/lab/orders`, data, getHospitalAuthHeader());
    return res.data;
  },

  submitResults: async (orderId, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/lab/orders/${orderId}/results`, data, getHospitalAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🏥 MEDICAL RECORD SERVICE
// =======================================================
export const medicalRecordService = {
  getByPatient: async (patientId) => {
    const res = await axios.get(
      `${HOSPITAL_API_URL}/medical-records/patient/${patientId}`,
      getAuthHeader()
    );
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(
      `${HOSPITAL_API_URL}/medical-records`,
      data,
      getAuthHeader()
    );
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(
      `${HOSPITAL_API_URL}/medical-records/${id}`,
      data,
      getAuthHeader()
    );
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(
      `${HOSPITAL_API_URL}/medical-records/${id}`,
      getAuthHeader()
    );
    return res.data;
  },

  addSurgeryRecord: async (patientId, data) => {
    const res = await axios.post(
      `${HOSPITAL_API_URL}/medical-records/surgery/${patientId}`,
      data,
      getAuthHeader()
    );
    return res.data;
  },
};


// =======================================================
// 🛏 WARD SERVICE
// =======================================================
export const wardService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/wards`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/wards`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/wards/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/wards/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🧑‍⚕️ DOCTOR SERVICE
// =======================================================
export const doctorService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/doctors`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/doctors`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/doctors/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/doctors/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🏢 DEPARTMENT SERVICE
// =======================================================
export const departmentService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/departments`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/departments`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/departments/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/departments/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🏥 INSURANCE PROVIDER SERVICE
// =======================================================
export const insuranceProviderService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/insurance-providers`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/insurance-providers`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/insurance-providers/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/insurance-providers/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 💊 PRESCRIPTION SERVICE
// =======================================================
export const prescriptionService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/prescriptions`, getAuthHeader());
    return res.data;
  },

  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/prescriptions/patient/${patientId}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/prescriptions`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/prescriptions/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/prescriptions/${id}`, getAuthHeader());
    return res.data;
  },
};

// =======================================================
// 🧬 SPECIALIZATION SERVICE
// =======================================================
export const specializationService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/specializations`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/specializations`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/specializations/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/specializations/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🏥 ADMISSION SERVICE
// =======================================================
export const admissionService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/admissions`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/admissions/${id}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/admissions`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/admissions/${id}`, data, getAuthHeader());
    return res.data;
  },

  discharge: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/admissions/${id}/discharge`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/admissions/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🩺 VITAL SIGNS SERVICE
// =======================================================
export const vitalSignsService = {
  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/vital-signs/patient/${patientId}`, getAuthHeader());
    return res.data;
  },

  getLatestByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/vital-signs/patient/${patientId}/latest`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/vital-signs`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/vital-signs/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/vital-signs/${id}`, getAuthHeader());
    return res.data;
  },
};

// Default export with all services
const hospitalService = {
  getPatients: patientService.getAll,
  getPatient: patientService.getById,
  createPatient: patientService.create,
  updatePatient: patientService.update,
  deletePatient: patientService.remove,

  getAppointments: appointmentService.getAll,
  createAppointment: appointmentService.create,
  updateAppointment: appointmentService.update,
  deleteAppointment: appointmentService.remove,

  getBills: billingService.getAll,
  getBillsByPatient: billingService.getByPatient,
  createBill: billingService.create,
  payBill: billingService.markAsPaid,
  deleteBill: billingService.remove,

  getLabTests: labService.getAll,
  getLabTestsByPatient: labService.getByPatient,
  createLabTest: labService.create,
  updateLabTest: labService.update,
  deleteLabTest: labService.remove,

  getLabOrders: labService.getAllOrders,
  getLabOrderById: labService.getOrderById,
  createLabOrder: labService.createOrder,
  submitLabResults: labService.submitResults,

  getMedicalRecords: medicalRecordService.getByPatient,
  getAllMedicalRecords: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/medical-records`, getAuthHeader());
    return res.data;
  },
  getMedicalRecordById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/medical-records/${id}`, getAuthHeader());
    return res.data;
  },
  createMedicalRecord: medicalRecordService.create,
  updateMedicalRecord: medicalRecordService.update,
  deleteMedicalRecord: medicalRecordService.remove,
  addSurgeryRecord: medicalRecordService.addSurgeryRecord,

  getWards: wardService.getAll,
  createWard: wardService.create,
  updateWard: wardService.update,
  deleteWard: wardService.remove,
  assignBed: wardService.update,

  getDoctors: doctorService.getAll,
  createDoctor: doctorService.create,
  updateDoctor: doctorService.update,
  deleteDoctor: doctorService.remove,

  getDepartments: departmentService.getAll,
  createDepartment: departmentService.create,
  updateDepartment: departmentService.update,
  deleteDepartment: departmentService.remove,

  getSpecializations: specializationService.getAll,
  createSpecialization: specializationService.create,
  updateSpecialization: specializationService.update,
  deleteSpecialization: specializationService.remove,

  getInsuranceProviders: insuranceProviderService.getAll,
  createInsuranceProvider: insuranceProviderService.create,
  updateInsuranceProvider: insuranceProviderService.update,
  deleteInsuranceProvider: insuranceProviderService.remove,

  getPrescriptions: prescriptionService.getAll,
  getPrescriptionsByPatient: prescriptionService.getByPatient,
  createPrescription: prescriptionService.create,
  updatePrescription: prescriptionService.update,
  deletePrescription: prescriptionService.remove,

  getVitalSigns: vitalSignsService.getByPatient,
  getLatestVitalSigns: vitalSignsService.getLatestByPatient,
  createVitalSigns: vitalSignsService.create,
  updateVitalSigns: vitalSignsService.update,
  deleteVitalSigns: vitalSignsService.remove,

  // Surgery Records
  getSurgeryRecords: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/surgery-records`, getAuthHeader());
    return res.data;
  },
  getSurgeryRecordById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/surgery-records/${id}`, getAuthHeader());
    return res.data;
  },
  getSurgeryRecordsByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/surgery-records/patient/${patientId}`, getAuthHeader());
    return res.data;
  },
  createSurgeryRecord: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/surgery-records`, data, getAuthHeader());
    return res.data;
  },
  updateSurgeryRecord: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/surgery-records/${id}`, data, getAuthHeader());
    return res.data;
  },
  deleteSurgeryRecord: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/surgery-records/${id}`, getAuthHeader());
    return res.data;
  },

  // Treatment Plans
  getTreatmentPlans: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/treatment-plans`, getAuthHeader());
    return res.data;
  },
  getTreatmentPlanById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/treatment-plans/${id}`, getAuthHeader());
    return res.data;
  },
  getTreatmentPlansByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/treatment-plans/patient/${patientId}`, getAuthHeader());
    return res.data;
  },
  createTreatmentPlan: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/treatment-plans`, data, getAuthHeader());
    return res.data;
  },
  updateTreatmentPlan: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/treatment-plans/${id}`, data, getAuthHeader());
    return res.data;
  },
  deleteTreatmentPlan: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/treatment-plans/${id}`, getAuthHeader());
    return res.data;
  },

  getAdmissions: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/admissions`, getAuthHeader());
    return res.data;
  },
  getAdmissionById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/admissions/${id}`, getAuthHeader());
    return res.data;
  },
  createAdmission: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/admissions`, data, getAuthHeader());
    return res.data;
  },
  updateAdmission: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/admissions/${id}`, data, getAuthHeader());
    return res.data;
  },
  dischargeAdmission: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/admissions/${id}/discharge`, data, getAuthHeader());
    return res.data;
  },
  deleteAdmission: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/admissions/${id}`, getAuthHeader());
    return res.data;
  },

  getReports: async () => [],

  // Admin Profile Management
  updateAdminProfile: async (profileData) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/auth/profile`, profileData, getHospitalAuthHeader());
    return res.data;
  },

  changeAdminPassword: async (passwordData) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/auth/password`, passwordData, getHospitalAuthHeader());
    return res.data;
  },

  updateHospitalSettings: async (settings) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/auth/settings`, settings, getHospitalAuthHeader());
    return res.data;
  },

  getAnalytics: async (timeRange = '7d') => {
    const res = await axios.get(`${HOSPITAL_API_URL}/auth/analytics?timeRange=${timeRange}`, getHospitalAuthHeader());
    return res.data;
  },
};

// =======================================================
// 🏥 SUPER ADMIN SERVICE
// =======================================================
export const superAdminService = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/dashboard/stats`, getSuperAdminAuthHeader());
    return res.data;
  },

  getSystemActivity: async () => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/dashboard/activity`, getSuperAdminAuthHeader());
    return res.data;
  },

  getSystemSettings: async () => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/dashboard/settings`, getSuperAdminAuthHeader());
    return res.data;
  },

  getAllHospitals: async () => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/hospitals`, getSuperAdminAuthHeader());
    return res.data;
  },

  getHospital: async (id) => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/hospitals/${id}`, getSuperAdminAuthHeader());
    return res.data;
  },

  createHospital: async (data) => {
    const res = await axios.post(`${SUPER_ADMIN_API_URL}/hospitals`, data, getSuperAdminAuthHeader());
    return res.data;
  },

  updateHospital: async (id, data) => {
    const res = await axios.put(`${SUPER_ADMIN_API_URL}/hospitals/${id}`, data, getSuperAdminAuthHeader());
    return res.data;
  },

  updateHospitalStatus: async (id, status) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospitals/${id}/status`, { status }, getSuperAdminAuthHeader());
    return res.data;
  },

  updateHospitalFeatures: async (id, features) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospitals/${id}/features`, { features }, getSuperAdminAuthHeader());
    return res.data;
  },

  softDeleteHospital: async (id) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospitals/${id}/soft-delete`, {}, getSuperAdminAuthHeader());
    return res.data;
  },

  hardDeleteHospital: async (id) => {
    const res = await axios.delete(`${SUPER_ADMIN_API_URL}/hospitals/${id}`, getSuperAdminAuthHeader());
    return res.data;
  },

  getAllHospitalAdmins: async () => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/hospital-admins`, getSuperAdminAuthHeader());
    return res.data;
  },

  getHospitalAdminsByHospital: async (hospitalId) => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/hospital-admins/hospital/${hospitalId}`, getSuperAdminAuthHeader());
    return res.data;
  },

  getHospitalAdmin: async (id) => {
    const res = await axios.get(`${SUPER_ADMIN_API_URL}/hospital-admins/${id}`, getSuperAdminAuthHeader());
    return res.data;
  },

  createHospitalAdmin: async (data) => {
    const res = await axios.post(`${SUPER_ADMIN_API_URL}/hospital-admins`, data, getSuperAdminAuthHeader());
    return res.data;
  },

  updateHospitalAdminStatus: async (id, status) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospital-admins/${id}/status`, { status }, getSuperAdminAuthHeader());
    return res.data;
  },

  resetHospitalAdminPassword: async (id, newPassword) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospital-admins/${id}/reset-password`, { newPassword }, getSuperAdminAuthHeader());
    return res.data;
  },

  trackAdminActivity: async (id) => {
    const res = await axios.patch(`${SUPER_ADMIN_API_URL}/hospital-admins/${id}/track-activity`, {}, getSuperAdminAuthHeader());
    return res.data;
  },

  deleteHospitalAdmin: async (id) => {
    const res = await axios.delete(`${SUPER_ADMIN_API_URL}/hospital-admins/${id}`, getSuperAdminAuthHeader());
    return res.data;
  },

  reassignHospital: async (adminId, hospitalId) => {
    const res = await axios.patch(
      `${SUPER_ADMIN_API_URL}/hospital-admins/${adminId}/hospital`,
      { hospitalId, docId: adminId },
      getSuperAdminAuthHeader()
    );
    return res.data;
  },
};

export default hospitalService;