import { db } from '../../../utils/firebase.js';

export const generateDepartmentReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { startDate, endDate, departmentId } = req.query;

    // Get hospital info
    const hospitalDoc = await db().collection('hospitals').doc(hospitalId).get();
    const hospitalInfo = hospitalDoc.data();

    const departmentsRef = db().collection('hospitals').doc(hospitalId).collection('departments');
    const doctorsRef = db().collection('hospitals').doc(hospitalId).collection('doctors');
    const patientsRef = db().collection('hospitals').doc(hospitalId).collection('patients');
    const appointmentsRef = db().collection('hospitals').doc(hospitalId).collection('appointments');
    const admissionsRef = db().collection('hospitals').doc(hospitalId).collection('admissions');
    const billingRef = db().collection('hospitals').doc(hospitalId).collection('billing');
    const medicalRecordsRef = db().collection('hospitals').doc(hospitalId).collection('medicalRecords');

    // Get all data
    const [departmentsSnapshot, doctorsSnapshot, patientsSnapshot, appointmentsSnapshot, 
           admissionsSnapshot, billingSnapshot, medicalRecordsSnapshot] = await Promise.all([
      departmentsRef.get(),
      doctorsRef.get(),
      patientsRef.get(),
      appointmentsRef.get(),
      admissionsRef.get(),
      billingRef.get(),
      medicalRecordsRef.get()
    ]);

    const departments = departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const patients = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const appointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const admissions = admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const billings = billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const medicalRecords = medicalRecordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter by date range if provided
    const filterByDate = (items, dateField) => {
      if (!startDate && !endDate) return items;
      return items.filter(item => {
        const itemDate = new Date(item[dateField]);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return itemDate >= start && itemDate <= end;
      });
    };

    const filteredAppointments = filterByDate(appointments, 'appointmentDate');
    const filteredAdmissions = filterByDate(admissions, 'admissionDate');
    const filteredBillings = filterByDate(billings, 'createdAt');

    // Generate comprehensive department reports
    const departmentReports = departments.map(department => {
      const deptDoctors = doctors.filter(doc => doc.departmentId === department.id);
      const deptPatients = patients.filter(p => p.departmentId === department.id);
      const deptAppointments = filteredAppointments.filter(apt => apt.departmentId === department.id);
      const deptAdmissions = filteredAdmissions.filter(adm => adm.departmentId === department.id);
      const deptBillings = filteredBillings.filter(bill => bill.departmentId === department.id);
      const deptMedicalRecords = medicalRecords.filter(mr => mr.departmentId === department.id);

      // Financial metrics
      const totalRevenue = deptBillings.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
      const avgRevenuePerPatient = deptAdmissions.length > 0 ? totalRevenue / deptAdmissions.length : 0;
      const totalCosts = deptBillings.reduce((sum, bill) => sum + (parseFloat(bill.costs) || 0), 0);
      const netProfit = totalRevenue - totalCosts;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      // Operational metrics
      const bedOccupancyRate = department.totalBeds ? 
        ((deptAdmissions.filter(adm => !adm.dischargeDate).length / department.totalBeds) * 100) : 0;
      const avgLengthOfStay = deptAdmissions
        .filter(adm => adm.dischargeDate)
        .reduce((sum, adm) => {
          const los = (new Date(adm.dischargeDate) - new Date(adm.admissionDate)) / (1000 * 60 * 60 * 24);
          return sum + los;
        }, 0) / deptAdmissions.filter(adm => adm.dischargeDate).length || 0;

      // Quality metrics
      const readmissionRate = deptAdmissions.filter(adm => adm.isReadmission).length / deptAdmissions.length * 100 || 0;
      const patientSatisfactionScore = deptPatients.reduce((sum, p) => sum + (p.satisfactionScore || 0), 0) / deptPatients.length || 0;

      // Staff performance
      const doctorPerformance = deptDoctors.map(doctor => {
        const doctorAppointments = deptAppointments.filter(apt => apt.doctorId === doctor.id);
        const doctorAdmissions = deptAdmissions.filter(adm => adm.doctorId === doctor.id);
        const doctorRevenue = deptBillings
          .filter(bill => bill.doctorId === doctor.id)
          .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
        const doctorPatients = deptPatients.filter(p => p.primaryDoctorId === doctor.id);
        const patientSatisfaction = doctorPatients.reduce((sum, p) => sum + (p.satisfactionScore || 0), 0) / doctorPatients.length || 0;

        return {
          doctorId: doctor.id,
          name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experienceYears,
          metrics: {
            totalAppointments: doctorAppointments.length,
            totalAdmissions: doctorAdmissions.length,
            totalPatients: doctorPatients.length,
            totalRevenue: doctorRevenue.toFixed(2),
            avgRevenuePerAppointment: doctorAppointments.length > 0 ? 
              (doctorRevenue / doctorAppointments.length).toFixed(2) : '0.00',
            patientSatisfactionScore: patientSatisfaction.toFixed(1),
            utilizationRate: ((doctorAppointments.length / (doctor.workingDaysPerWeek * 8)) * 100).toFixed(1)
          }
        };
      });

      // Service analysis
      const serviceAnalysis = deptBillings.reduce((acc, bill) => {
        if (bill.services) {
          bill.services.forEach(service => {
            if (!acc[service.name]) {
              acc[service.name] = { count: 0, revenue: 0, avgCost: 0 };
            }
            acc[service.name].count++;
            acc[service.name].revenue += parseFloat(service.amount) || 0;
            acc[service.name].avgCost = acc[service.name].revenue / acc[service.name].count;
          });
        }
        return acc;
      }, {});

      return {
        departmentInfo: {
          id: department.id,
          name: department.name,
          description: department.description,
          headOfDepartment: department.headOfDepartment,
          location: department.location,
          contactInfo: {
            phone: department.phone,
            email: department.email,
            extension: department.extension
          },
          capacity: {
            totalBeds: department.totalBeds || 0,
            availableBeds: department.availableBeds || 0,
            occupiedBeds: (department.totalBeds || 0) - (department.availableBeds || 0)
          },
          operatingHours: department.operatingHours
        },
        executiveSummary: {
          reportPeriod: `${startDate || 'All time'} to ${endDate || 'Present'}`,
          keyMetrics: {
            totalPatients: deptPatients.length,
            totalAppointments: deptAppointments.length,
            totalAdmissions: deptAdmissions.length,
            totalRevenue: totalRevenue.toFixed(2),
            netProfit: netProfit.toFixed(2),
            profitMargin: profitMargin.toFixed(1) + '%',
            bedOccupancyRate: bedOccupancyRate.toFixed(1) + '%',
            avgLengthOfStay: avgLengthOfStay.toFixed(1) + ' days',
            patientSatisfactionScore: patientSatisfactionScore.toFixed(1) + '/5'
          },
          performanceIndicators: {
            readmissionRate: readmissionRate.toFixed(1) + '%',
            avgRevenuePerPatient: avgRevenuePerPatient.toFixed(2),
            staffUtilizationRate: ((deptDoctors.length * 40) > 0 ? 
              (deptAppointments.length / (deptDoctors.length * 40)) * 100 : 0).toFixed(1) + '%'
          }
        },
        financialAnalysis: {
          revenueBreakdown: {
            totalRevenue: totalRevenue.toFixed(2),
            totalCosts: totalCosts.toFixed(2),
            grossProfit: (totalRevenue - totalCosts).toFixed(2),
            profitMargin: profitMargin.toFixed(1) + '%'
          },
          topRevenueServices: Object.entries(serviceAnalysis)
            .sort(([,a], [,b]) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(([service, data]) => ({
              service,
              count: data.count,
              totalRevenue: data.revenue.toFixed(2),
              avgRevenue: data.avgCost.toFixed(2)
            }))
        },
        operationalMetrics: {
          bedManagement: {
            totalBeds: department.totalBeds || 0,
            occupiedBeds: (department.totalBeds || 0) - (department.availableBeds || 0),
            occupancyRate: bedOccupancyRate.toFixed(1) + '%',
            avgLengthOfStay: avgLengthOfStay.toFixed(1) + ' days'
          },
          patientFlow: {
            totalAdmissions: deptAdmissions.length,
            totalDischarges: deptAdmissions.filter(adm => adm.dischargeDate).length,
            currentInpatients: deptAdmissions.filter(adm => !adm.dischargeDate).length
          },
          staffWorkload: {
            totalDoctors: deptDoctors.length,
            avgPatientsPerDoctor: deptDoctors.length > 0 ? (deptPatients.length / deptDoctors.length).toFixed(1) : '0',
            avgAppointmentsPerDoctor: deptDoctors.length > 0 ? (deptAppointments.length / deptDoctors.length).toFixed(1) : '0'
          }
        },
        qualityMetrics: {
          patientSafety: {
            readmissionRate: readmissionRate.toFixed(1) + '%'
          },
          patientSatisfaction: {
            overallScore: patientSatisfactionScore.toFixed(1) + '/5'
          }
        },
        staffPerformance: {
          doctorPerformance: doctorPerformance.sort((a, b) => 
            parseFloat(b.metrics.totalRevenue) - parseFloat(a.metrics.totalRevenue)),
          departmentLeadership: {
            headOfDepartment: department.headOfDepartment
          }
        },
        detailedData: {
          recentAppointments: deptAppointments.slice(0, 50).map(apt => ({
            id: apt.id,
            patientName: apt.patientName,
            doctorName: apt.doctorName,
            date: apt.appointmentDate,
            status: apt.status,
            type: apt.appointmentType
          })),
          recentAdmissions: deptAdmissions.slice(0, 50).map(adm => ({
            id: adm.id,
            patientName: adm.patientName,
            admissionDate: adm.admissionDate,
            dischargeDate: adm.dischargeDate,
            diagnosis: adm.primaryDiagnosis,
            status: adm.status
          }))
        }
      };
    });

    // Filter for specific department if requested
    const finalReport = departmentId ? 
      departmentReports.find(dept => dept.departmentInfo.id === departmentId) :
      departmentReports;

    const report = {
      reportHeader: {
        title: departmentId ? 'Department Performance Report' : 'Hospital Departments Overview Report',
        hospitalName: hospitalInfo?.name || 'Hospital',
        hospitalAddress: hospitalInfo?.address || '',
        reportType: 'Professional Department Analysis',
        generatedAt: new Date().toISOString(),
        generatedBy: req.user.name || 'System Administrator',
        reportPeriod: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present',
          totalDays: startDate && endDate ? 
            Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 'N/A'
        },
        confidentiality: 'CONFIDENTIAL - For Internal Use Only'
      },
      executiveSummary: departmentId ? null : {
        totalDepartments: departments.length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        hospitalOccupancyRate: departments.reduce((sum, dept) => {
          const rate = dept.totalBeds ? ((dept.totalBeds - dept.availableBeds) / dept.totalBeds) * 100 : 0;
          return sum + rate;
        }, 0) / departments.length || 0,
        totalHospitalRevenue: billings.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0)
      },
      departmentData: finalReport,
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
    console.error('Error generating department report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate department report',
      error: error.message
    });
  }
};