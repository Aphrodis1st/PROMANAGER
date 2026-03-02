import axios from "axios";

const HOSPITAL_API_URL = "http://localhost:5000/api/v1/hospital";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});


// =======================================================
// 🏥 PATIENT SERVICE
// =======================================================
export const patientService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/patients`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/patients/${id}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/patients`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/patients/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/patients/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 📅 APPOINTMENT SERVICE
// =======================================================
export const appointmentService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/appointments`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/appointments`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/appointments/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/appointments/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 💰 BILLING SERVICE
// =======================================================
export const billingService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/billing`, getAuthHeader());
    return res.data;
  },

  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/billing/patient/${patientId}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/billing`, data, getAuthHeader());
    return res.data;
  },

  markAsPaid: async (id) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/billing/${id}/pay`, {}, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/billing/${id}`, getAuthHeader());
    return res.data;
  },
};


// =======================================================
// 🧪 LAB SERVICE
// =======================================================
export const labService = {
  getAll: async () => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab`, getAuthHeader());
    return res.data;
  },

  getByPatient: async (patientId) => {
    const res = await axios.get(`${HOSPITAL_API_URL}/lab/patient/${patientId}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${HOSPITAL_API_URL}/lab`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${HOSPITAL_API_URL}/lab/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${HOSPITAL_API_URL}/lab/${id}`, getAuthHeader());
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

  getMedicalRecords: medicalRecordService.getByPatient,
  createMedicalRecord: medicalRecordService.create,
  updateMedicalRecord: medicalRecordService.update,
  deleteMedicalRecord: medicalRecordService.remove,

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

  getAdmissions: async () => [],
  getReports: async () => [],
};

export default hospitalService;