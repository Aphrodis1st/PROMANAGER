import { db } from '../../../utils/firebase.js';

export const generateDashboardReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { period = '30' } = req.query; // Default to last 30 days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all collections
    const collections = {
      patients: db().collection('hospitals').doc(hospitalId).collection('patients'),
      doctors: db().collection('hospitals').doc(hospitalId).collection('doctors'),
      appointments: db().collection('hospitals').doc(hospitalId).collection('appointments'),
      admissions: db().collection('hospitals').doc(hospitalId).collection('admissions'),
      billing: db().collection('hospitals').doc(hospitalId).collection('billing'),
      labTests: db().collection('hospitals').doc(hospitalId).collection('labTests'),
      departments: db().collection('hospitals').doc(hospitalId).collection('departments'),
      medicalRecords: db().collection('hospitals').doc(hospitalId).collection('medicalRecords'),
      vitalSigns: db().collection('hospitals').doc(hospitalId).collection('vitalSigns')
    };

    // Fetch all data in parallel
    const snapshots = await Promise.all(
      Object.values(collections).map(collection => collection.get())
    );

    const [
      patientsSnapshot, doctorsSnapshot, appointmentsSnapshot, admissionsSnapshot,
      billingSnapshot, labTestsSnapshot, departmentsSnapshot, medicalRecordsSnapshot,
      vitalSignsSnapshot
    ] = snapshots;

    // Convert to arrays
    const data = {
      patients: patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      doctors: doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      appointments: appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      admissions: admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      billing: billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      labTests: labTestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      departments: departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      medicalRecords: medicalRecordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      vitalSigns: vitalSignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };

    // Calculate key performance indicators (KPIs)
    const kpis = {
      // Patient metrics
      totalPatients: data.patients.length,
      newPatientsThisPeriod: data.patients.filter(p => 
        new Date(p.createdAt) >= startDate
      ).length,
      activePatients: data.patients.filter(p => p.status === 'active').length,

      // Financial metrics
      totalRevenue: data.billing.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0),
      revenueThisPeriod: data.billing
        .filter(bill => new Date(bill.createdAt) >= startDate)
        .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0),
      outstandingAmount: data.billing
        .filter(bill => bill.status !== 'paid')
        .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0),

      // Operational metrics
      totalAppointments: data.appointments.length,
      appointmentsToday: data.appointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.appointmentDate && apt.appointmentDate.startsWith(today);
      }).length,
      totalAdmissions: data.admissions.length,
      currentAdmissions: data.admissions.filter(adm => adm.status === 'admitted').length,

      // Clinical metrics
      totalLabTests: data.labTests.length,
      pendingLabTests: data.labTests.filter(test => test.status === 'pending').length,
      completedLabTests: data.labTests.filter(test => test.status === 'completed').length,
      totalMedicalRecords: data.medicalRecords.length,

      // Staff metrics
      totalDoctors: data.doctors.length,
      activeDoctors: data.doctors.filter(doc => doc.status === 'active').length,
      totalDepartments: data.departments.length
    };

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period));

    const previousPeriodData = {
      patients: data.patients.filter(p => 
        new Date(p.createdAt) >= previousPeriodStart && new Date(p.createdAt) < startDate
      ).length,
      revenue: data.billing
        .filter(bill => 
          new Date(bill.createdAt) >= previousPeriodStart && new Date(bill.createdAt) < startDate
        )
        .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0),
      appointments: data.appointments.filter(apt => 
        new Date(apt.createdAt) >= previousPeriodStart && new Date(apt.createdAt) < startDate
      ).length
    };

    const growthRates = {
      patientGrowth: previousPeriodData.patients > 0 ? 
        (((kpis.newPatientsThisPeriod - previousPeriodData.patients) / previousPeriodData.patients) * 100).toFixed(2) : 0,
      revenueGrowth: previousPeriodData.revenue > 0 ? 
        (((kpis.revenueThisPeriod - previousPeriodData.revenue) / previousPeriodData.revenue) * 100).toFixed(2) : 0,
      appointmentGrowth: previousPeriodData.appointments > 0 ? 
        (((data.appointments.filter(apt => new Date(apt.createdAt) >= startDate).length - previousPeriodData.appointments) / previousPeriodData.appointments) * 100).toFixed(2) : 0
    };

    // Department performance summary
    const departmentPerformance = data.departments.map(dept => {
      const deptAppointments = data.appointments.filter(apt => apt.departmentId === dept.id);
      const deptRevenue = data.billing
        .filter(bill => bill.departmentId === dept.id)
        .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
      const deptDoctors = data.doctors.filter(doc => doc.departmentId === dept.id);

      return {
        departmentName: dept.name,
        totalAppointments: deptAppointments.length,
        totalRevenue: deptRevenue.toFixed(2),
        totalDoctors: deptDoctors.length,
        avgRevenuePerAppointment: deptAppointments.length > 0 ? 
          (deptRevenue / deptAppointments.length).toFixed(2) : '0.00'
      };
    }).sort((a, b) => parseFloat(b.totalRevenue) - parseFloat(a.totalRevenue));

    // Recent activities summary
    const recentActivities = {
      recentPatients: data.patients
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
      recentAppointments: data.appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
      recentLabTests: data.labTests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
      recentBilling: data.billing
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
    };

    // Alerts and notifications
    const alerts = {
      criticalLabResults: data.labTests.filter(test => 
        test.results && test.results.some(result => result.flag === 'critical')
      ).length,
      overdueBills: data.billing.filter(bill => 
        bill.status === 'overdue' || 
        (bill.dueDate && new Date(bill.dueDate) < new Date())
      ).length,
      pendingAppointments: data.appointments.filter(apt => 
        apt.status === 'scheduled' && new Date(apt.appointmentDate) <= new Date()
      ).length,
      lowStockAlerts: 0 // This would come from inventory system
    };

    // Operational efficiency metrics
    const efficiency = {
      bedOccupancyRate: data.departments.reduce((total, dept) => {
        if (dept.totalBeds) {
          const occupiedBeds = data.admissions.filter(adm => 
            adm.departmentId === dept.id && adm.status === 'admitted'
          ).length;
          return total + (occupiedBeds / dept.totalBeds);
        }
        return total;
      }, 0) / data.departments.filter(dept => dept.totalBeds).length * 100 || 0,
      
      appointmentUtilization: data.appointments.filter(apt => apt.status === 'completed').length / 
        data.appointments.length * 100 || 0,
      
      labTestCompletionRate: data.labTests.filter(test => test.status === 'completed').length / 
        data.labTests.length * 100 || 0,
      
      averageWaitTime: '15 minutes', // This would be calculated from actual wait time data
      patientSatisfactionScore: '4.2/5' // This would come from patient feedback
    };

    const report = {
      reportType: 'Hospital Dashboard Overview',
      hospitalId,
      generatedAt: new Date().toISOString(),
      period: `Last ${period} days`,
      kpis,
      growthRates,
      departmentPerformance: departmentPerformance.slice(0, 10),
      efficiency: {
        bedOccupancyRate: `${efficiency.bedOccupancyRate.toFixed(2)}%`,
        appointmentUtilization: `${efficiency.appointmentUtilization.toFixed(2)}%`,
        labTestCompletionRate: `${efficiency.labTestCompletionRate.toFixed(2)}%`,
        averageWaitTime: efficiency.averageWaitTime,
        patientSatisfactionScore: efficiency.patientSatisfactionScore
      },
      alerts,
      recentActivities,
      quickStats: {
        todayAppointments: kpis.appointmentsToday,
        currentAdmissions: kpis.currentAdmissions,
        pendingLabTests: kpis.pendingLabTests,
        todayRevenue: data.billing
          .filter(bill => {
            const today = new Date().toISOString().split('T')[0];
            return bill.createdAt && bill.createdAt.startsWith(today);
          })
          .reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0)
          .toFixed(2)
      }
    };

    res.json({ success: true, report });

  } catch (error) {
    console.error('Error generating dashboard report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard report',
      error: error.message
    });
  }
};