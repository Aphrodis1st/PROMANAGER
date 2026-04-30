import { db } from '../../../utils/firebase.js';

export const generateMedicalRecordReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { startDate, endDate, departmentId } = req.query;

    const medicalRecordsRef = db().collection('hospitals').doc(hospitalId).collection('medicalRecords');
    const vitalSignsRef = db().collection('hospitals').doc(hospitalId).collection('vitalSigns');
    const prescriptionsRef = db().collection('hospitals').doc(hospitalId).collection('prescriptions');

    // Get medical records
    const recordsSnapshot = await medicalRecordsRef.get();
    const records = recordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get vital signs
    const vitalSignsSnapshot = await vitalSignsRef.get();
    const vitalSigns = vitalSignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get prescriptions
    const prescriptionsSnapshot = await prescriptionsRef.get();
    const prescriptions = prescriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Clinical analytics
    const totalRecords = records.length;
    const recordsWithDiagnosis = records.filter(r => r.diagnosis && r.diagnosis.length > 0).length;
    const recordsWithTreatment = records.filter(r => r.treatmentPlan).length;

    // Diagnosis frequency analysis
    const diagnosisFrequency = {};
    records.forEach(record => {
      if (record.diagnosis) {
        record.diagnosis.forEach(diag => {
          diagnosisFrequency[diag] = (diagnosisFrequency[diag] || 0) + 1;
        });
      }
    });

    // Prescription analysis
    const medicationFrequency = {};
    prescriptions.forEach(prescription => {
      if (prescription.medications) {
        prescription.medications.forEach(med => {
          medicationFrequency[med.name] = (medicationFrequency[med.name] || 0) + 1;
        });
      }
    });

    // Vital signs analysis
    const vitalSignsAnalysis = {
      totalReadings: vitalSigns.length,
      averageBloodPressure: {
        systolic: 0,
        diastolic: 0
      },
      averageHeartRate: 0,
      averageTemperature: 0
    };

    if (vitalSigns.length > 0) {
      const validBP = vitalSigns.filter(v => v.bloodPressure);
      const validHR = vitalSigns.filter(v => v.heartRate);
      const validTemp = vitalSigns.filter(v => v.temperature);

      if (validBP.length > 0) {
        vitalSignsAnalysis.averageBloodPressure.systolic = 
          validBP.reduce((sum, v) => sum + (v.bloodPressure.systolic || 0), 0) / validBP.length;
        vitalSignsAnalysis.averageBloodPressure.diastolic = 
          validBP.reduce((sum, v) => sum + (v.bloodPressure.diastolic || 0), 0) / validBP.length;
      }

      if (validHR.length > 0) {
        vitalSignsAnalysis.averageHeartRate = 
          validHR.reduce((sum, v) => sum + (v.heartRate || 0), 0) / validHR.length;
      }

      if (validTemp.length > 0) {
        vitalSignsAnalysis.averageTemperature = 
          validTemp.reduce((sum, v) => sum + (v.temperature || 0), 0) / validTemp.length;
      }
    }

    // Monthly trends
    const monthlyRecords = records.reduce((acc, record) => {
      if (record.createdAt) {
        const month = new Date(record.createdAt).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    const report = {
      reportType: 'Medical Records Clinical Report',
      hospitalId,
      generatedAt: new Date().toISOString(),
      period: { startDate, endDate },
      summary: {
        totalRecords,
        recordsWithDiagnosis,
        recordsWithTreatment,
        totalPrescriptions: prescriptions.length,
        totalVitalSigns: vitalSigns.length,
        completionRate: ((recordsWithDiagnosis / totalRecords) * 100).toFixed(2)
      },
      clinicalAnalytics: {
        topDiagnoses: Object.entries(diagnosisFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([diagnosis, count]) => ({ diagnosis, count })),
        topMedications: Object.entries(medicationFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([medication, count]) => ({ medication, count })),
        vitalSignsAnalysis
      },
      trends: {
        monthlyRecords
      },
      detailedData: {
        recentRecords: records.slice(0, 50),
        recentPrescriptions: prescriptions.slice(0, 50),
        recentVitalSigns: vitalSigns.slice(0, 50)
      }
    };

    res.json({ success: true, report });

  } catch (error) {
    console.error('Error generating medical record report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate medical record report',
      error: error.message
    });
  }
};