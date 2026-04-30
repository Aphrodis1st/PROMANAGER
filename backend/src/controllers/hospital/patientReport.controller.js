import { db } from '../../../utils/firebase.js';

export const generatePatientReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { startDate, endDate, departmentId, patientId, reportType = 'comprehensive' } = req.query;

    // Get hospital info
    const hospitalDoc = await db().collection('hospitals').doc(hospitalId).get();
    const hospitalInfo = hospitalDoc.data();

    const patientsRef = db().collection('hospitals').doc(hospitalId).collection('patients');
    const admissionsRef = db().collection('hospitals').doc(hospitalId).collection('admissions');
    const appointmentsRef = db().collection('hospitals').doc(hospitalId).collection('appointments');
    const medicalRecordsRef = db().collection('hospitals').doc(hospitalId).collection('medicalRecords');
    const billingRef = db().collection('hospitals').doc(hospitalId).collection('billing');
    const labOrdersRef = db().collection('hospitals').doc(hospitalId).collection('labOrders');
    const vitalSignsRef = db().collection('hospitals').doc(hospitalId).collection('vitalSigns');
    const departmentsRef = db().collection('hospitals').doc(hospitalId).collection('departments');
    const doctorsRef = db().collection('hospitals').doc(hospitalId).collection('doctors');

    // Get all data
    const [patientsSnapshot, admissionsSnapshot, appointmentsSnapshot, medicalRecordsSnapshot,
           billingSnapshot, labOrdersSnapshot, vitalSignsSnapshot, departmentsSnapshot, doctorsSnapshot] = await Promise.all([
      patientsRef.get(),
      admissionsRef.get(),
      appointmentsRef.get(),
      medicalRecordsRef.get(),
      billingRef.get(),
      labOrdersRef.get(),
      vitalSignsRef.get(),
      departmentsRef.get(),
      doctorsRef.get()
    ]);

    const patients = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const admissions = admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const appointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const medicalRecords = medicalRecordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const billings = billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const labOrders = labOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const vitalSigns = vitalSignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const departments = departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter by date range
    const filterByDate = (items, dateField) => {
      if (!startDate && !endDate) return items;
      return items.filter(item => {
        const itemDate = new Date(item[dateField]);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return itemDate >= start && itemDate <= end;
      });
    };

    const filteredPatients = filterByDate(patients, 'createdAt');
    const filteredAdmissions = filterByDate(admissions, 'admissionDate');
    const filteredAppointments = filterByDate(appointments, 'appointmentDate');
    const filteredBillings = filterByDate(billings, 'createdAt');

    // Filter by department if specified
    const finalPatients = departmentId ? 
      filteredPatients.filter(p => p.departmentId === departmentId) : filteredPatients;

    // If specific patient report requested
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }

      const patientAdmissions = admissions.filter(adm => adm.patientId === patientId);
      const patientAppointments = appointments.filter(apt => apt.patientId === patientId);
      const patientMedicalRecords = medicalRecords.filter(mr => mr.patientId === patientId);
      const patientBillings = billings.filter(bill => bill.patientId === patientId);
      const patientLabOrders = labOrders.filter(lab => lab.patientId === patientId);
      const patientVitalSigns = vitalSigns.filter(vs => vs.patientId === patientId);

      const totalBilled = patientBillings.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
      const totalPaid = patientBillings.reduce((sum, bill) => sum + (parseFloat(bill.paidAmount) || 0), 0);
      const outstandingBalance = totalBilled - totalPaid;

      const report = {
        reportHeader: {
          title: 'Individual Patient Medical Report',
          hospitalName: hospitalInfo?.name || 'Hospital',
          hospitalAddress: hospitalInfo?.address || '',
          reportType: 'Comprehensive Patient Report',
          generatedAt: new Date().toISOString(),
          generatedBy: req.user.name || req.user.firstName + ' ' + req.user.lastName,
          confidentiality: 'CONFIDENTIAL - Protected Health Information'
        },
        patientInformation: {
          personalDetails: {
            patientId: patient.id,
            mrn: patient.mrn || patient.id,
            fullName: `${patient.firstName} ${patient.lastName}`,
            dateOfBirth: patient.dateOfBirth,
            age: patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A',
            gender: patient.gender,
            bloodType: patient.bloodType,
            maritalStatus: patient.maritalStatus
          },
          contactInformation: {
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            city: patient.city,
            state: patient.state,
            zipCode: patient.zipCode,
            country: patient.country
          },
          emergencyContact: {
            name: patient.emergencyContactName,
            relationship: patient.emergencyContactRelationship,
            phone: patient.emergencyContactPhone
          },
          insuranceInformation: {
            provider: patient.insuranceProvider,
            policyNumber: patient.insurancePolicyNumber,
            groupNumber: patient.insuranceGroupNumber,
            coverageType: patient.insuranceCoverageType
          }
        },
        medicalSummary: {
          totalVisits: patientAppointments.length,
          totalAdmissions: patientAdmissions.length,
          totalLabTests: patientLabOrders.length,
          activeDiagnoses: patientMedicalRecords.filter(mr => mr.diagnosis).length,
          allergies: patient.allergies || [],
          chronicConditions: patient.chronicConditions || [],
          currentMedications: patient.currentMedications || []
        },
        admissionHistory: patientAdmissions.map(adm => ({
          admissionId: adm.id,
          admissionDate: adm.admissionDate,
          dischargeDate: adm.dischargeDate,
          lengthOfStay: adm.dischargeDate ? 
            Math.ceil((new Date(adm.dischargeDate) - new Date(adm.admissionDate)) / (1000 * 60 * 60 * 24)) : 'Ongoing',
          department: departments.find(d => d.id === adm.departmentId)?.name || 'N/A',
          primaryDiagnosis: adm.primaryDiagnosis,
          attendingPhysician: doctors.find(d => d.id === adm.doctorId)?.firstName + ' ' + doctors.find(d => d.id === adm.doctorId)?.lastName || 'N/A',
          admissionType: adm.admissionType,
          status: adm.status
        })),
        appointmentHistory: patientAppointments.slice(0, 50).map(apt => ({
          appointmentId: apt.id,
          date: apt.appointmentDate,
          time: apt.appointmentTime,
          doctor: apt.doctorName,
          department: departments.find(d => d.id === apt.departmentId)?.name || 'N/A',
          type: apt.appointmentType,
          status: apt.status,
          reason: apt.reason
        })),
        medicalRecords: patientMedicalRecords.slice(0, 30).map(mr => ({
          recordId: mr.id,
          date: mr.createdAt,
          diagnosis: mr.diagnosis,
          symptoms: mr.symptoms,
          treatment: mr.treatment,
          prescriptions: mr.prescriptions,
          notes: mr.notes,
          doctor: doctors.find(d => d.id === mr.doctorId)?.firstName + ' ' + doctors.find(d => d.id === mr.doctorId)?.lastName || 'N/A'
        })),
        laboratoryResults: patientLabOrders.slice(0, 30).map(lab => ({
          orderId: lab.id,
          orderDate: lab.orderDate,
          testType: lab.testType,
          testName: lab.testName,
          status: lab.status,
          results: lab.results,
          normalRange: lab.normalRange,
          interpretation: lab.interpretation,
          orderedBy: doctors.find(d => d.id === lab.doctorId)?.firstName + ' ' + doctors.find(d => d.id === lab.doctorId)?.lastName || 'N/A'
        })),
        vitalSignsHistory: patientVitalSigns.slice(0, 20).map(vs => ({
          recordedAt: vs.recordedAt,
          bloodPressure: `${vs.systolic}/${vs.diastolic}`,
          heartRate: vs.heartRate,
          temperature: vs.temperature,
          respiratoryRate: vs.respiratoryRate,
          oxygenSaturation: vs.oxygenSaturation,
          weight: vs.weight,
          height: vs.height,
          bmi: vs.bmi
        })),
        financialSummary: {
          totalBilled: totalBilled.toFixed(2),
          totalPaid: totalPaid.toFixed(2),
          outstandingBalance: outstandingBalance.toFixed(2),
          insuranceCoverage: patientBillings.reduce((sum, bill) => sum + (parseFloat(bill.insuranceCoverage) || 0), 0).toFixed(2),
          patientResponsibility: patientBillings.reduce((sum, bill) => sum + (parseFloat(bill.patientResponsibility) || 0), 0).toFixed(2),
          billingHistory: patientBillings.slice(0, 20).map(bill => ({
            invoiceId: bill.id,
            date: bill.createdAt,
            amount: bill.totalAmount,
            paidAmount: bill.paidAmount,
            status: bill.status,
            services: bill.services
          }))
        },
        reportFooter: {
          disclaimer: 'This report contains confidential patient health information protected under HIPAA regulations.',
          dataAccuracy: 'All information is accurate as of the report generation date.',
          reportVersion: '2.0',
          contactInfo: 'For questions regarding this report, contact the Medical Records Department.'
        }
      };

      return res.json({ success: true, report });
    }

    // Generate comprehensive patient analytics report
    const totalPatients = finalPatients.length;
    const activePatients = finalPatients.filter(p => p.status === 'active').length;
    const inactivePatients = finalPatients.filter(p => p.status === 'inactive').length;
    
    // Age demographics
    const ageGroups = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };
    finalPatients.forEach(patient => {
      if (patient.dateOfBirth) {
        const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 35) ageGroups['19-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else if (age <= 65) ageGroups['51-65']++;
        else ageGroups['65+']++;
      }
    });

    // Gender distribution
    const genderDistribution = finalPatients.reduce((acc, patient) => {
      acc[patient.gender || 'unknown'] = (acc[patient.gender || 'unknown'] || 0) + 1;
      return acc;
    }, {});

    // Department-wise patient distribution
    const departmentDistribution = {};
    departments.forEach(dept => {
      const deptPatients = finalPatients.filter(p => p.departmentId === dept.id);
      departmentDistribution[dept.name] = deptPatients.length;
    });

    // Monthly patient registration trends
    const monthlyRegistrations = finalPatients.reduce((acc, patient) => {
      if (patient.createdAt) {
        const month = new Date(patient.createdAt).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    // Top diagnoses
    const diagnosisCount = {};
    medicalRecords.forEach(mr => {
      if (mr.diagnosis) {
        diagnosisCount[mr.diagnosis] = (diagnosisCount[mr.diagnosis] || 0) + 1;
      }
    });

    const report = {
      reportHeader: {
        title: 'Hospital Patient Analytics Report',
        hospitalName: hospitalInfo?.name || 'Hospital',
        hospitalAddress: hospitalInfo?.address || '',
        reportType: 'Comprehensive Patient Population Analysis',
        generatedAt: new Date().toISOString(),
        generatedBy: req.user.name || req.user.firstName + ' ' + req.user.lastName,
        reportPeriod: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present',
          totalDays: startDate && endDate ? 
            Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 'N/A'
        },
        confidentiality: 'CONFIDENTIAL - For Internal Use Only'
      },
      executiveSummary: {
        totalPatients,
        activePatients,
        inactivePatients,
        newPatientsInPeriod: filteredPatients.length,
        totalAdmissions: filteredAdmissions.length,
        totalAppointments: filteredAppointments.length,
        averageAge: finalPatients.reduce((sum, p) => {
          if (p.dateOfBirth) {
            return sum + (new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear());
          }
          return sum;
        }, 0) / finalPatients.filter(p => p.dateOfBirth).length || 0,
        totalRevenue: filteredBillings.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0).toFixed(2)
      },
      demographics: {
        ageDistribution: ageGroups,
        genderDistribution,
        departmentDistribution
      },
      clinicalMetrics: {
        topDiagnoses: Object.entries(diagnosisCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([diagnosis, count]) => ({ diagnosis, count })),
        admissionRate: (filteredAdmissions.length / totalPatients * 100).toFixed(1) + '%',
        readmissionRate: (filteredAdmissions.filter(adm => adm.isReadmission).length / filteredAdmissions.length * 100).toFixed(1) + '%',
        avgLengthOfStay: (filteredAdmissions
          .filter(adm => adm.dischargeDate)
          .reduce((sum, adm) => {
            const los = (new Date(adm.dischargeDate) - new Date(adm.admissionDate)) / (1000 * 60 * 60 * 24);
            return sum + los;
          }, 0) / filteredAdmissions.filter(adm => adm.dischargeDate).length || 0).toFixed(1) + ' days'
      },
      trends: {
        monthlyRegistrations: Object.entries(monthlyRegistrations)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, count]) => ({ month, count }))
      },
      detailedData: {
        recentPatients: finalPatients.slice(0, 100).map(p => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          age: p.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : 'N/A',
          gender: p.gender,
          phone: p.phone,
          registrationDate: p.createdAt,
          status: p.status
        })),
        recentAdmissions: filteredAdmissions.slice(0, 50).map(adm => ({
          id: adm.id,
          patientName: adm.patientName,
          admissionDate: adm.admissionDate,
          department: departments.find(d => d.id === adm.departmentId)?.name || 'N/A',
          diagnosis: adm.primaryDiagnosis,
          status: adm.status
        })),
        upcomingAppointments: filteredAppointments
          .filter(apt => new Date(apt.appointmentDate) > new Date())
          .slice(0, 50)
          .map(apt => ({
            id: apt.id,
            patientName: apt.patientName,
            date: apt.appointmentDate,
            doctor: apt.doctorName,
            department: departments.find(d => d.id === apt.departmentId)?.name || 'N/A'
          }))
      },
      reportFooter: {
        disclaimer: 'This report contains confidential and proprietary information. Distribution is restricted to authorized personnel only.',
        dataAccuracy: 'Data is accurate as of the report generation time. Real-time changes may not be reflected.',
        nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reportVersion: '2.0',
        contactInfo: 'For questions regarding this report, contact the Hospital Administration Office.'
      }
    };

    res.json({ success: true, report });

  } catch (error) {
    console.error('Error generating patient report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate patient report',
      error: error.message
    });
  }
};