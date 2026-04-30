import { db } from '../../../utils/firebase.js';

export const generateHospitalReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { startDate, endDate, reportType = 'comprehensive' } = req.query;

    // Collect data from all hospital modules
    const reportData = {
      hospital: hospitalId,
      generatedAt: new Date().toISOString(),
      period: { startDate, endDate },
      summary: {},
      details: {}
    };

    // Get patients data
    const patientsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('patients').get();
    reportData.summary.totalPatients = patientsSnapshot.size;
    reportData.details.patients = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get admissions data
    const admissionsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('admissions').get();
    reportData.summary.totalAdmissions = admissionsSnapshot.size;
    reportData.details.admissions = admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get appointments data
    const appointmentsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('appointments').get();
    reportData.summary.totalAppointments = appointmentsSnapshot.size;
    reportData.details.appointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get billing data
    const billingSnapshot = await db().collection('hospitals').doc(hospitalId).collection('billing').get();
    const totalRevenue = billingSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    reportData.summary.totalRevenue = totalRevenue;
    reportData.details.billing = billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get lab tests data
    const labSnapshot = await db().collection('hospitals').doc(hospitalId).collection('labTests').get();
    reportData.summary.totalLabTests = labSnapshot.size;
    reportData.details.labTests = labSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get medical records data
    const medicalRecordsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('medicalRecords').get();
    reportData.summary.totalMedicalRecords = medicalRecordsSnapshot.size;
    reportData.details.medicalRecords = medicalRecordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get doctors data
    const doctorsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('doctors').get();
    reportData.summary.totalDoctors = doctorsSnapshot.size;
    reportData.details.doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get departments data
    const departmentsSnapshot = await db().collection('hospitals').doc(hospitalId).collection('departments').get();
    reportData.summary.totalDepartments = departmentsSnapshot.size;
    reportData.details.departments = departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      success: true,
      report: reportData
    });

  } catch (error) {
    console.error('Error generating hospital report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate hospital report',
      error: error.message
    });
  }
};