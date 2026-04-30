import { db } from '../../../utils/firebase.js';

export const generateFinancialReport = async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const { startDate, endDate, departmentId } = req.query;

    const billingRef = db().collection('hospitals').doc(hospitalId).collection('billing');
    const paymentsRef = db().collection('hospitals').doc(hospitalId).collection('payments');
    const admissionsRef = db().collection('hospitals').doc(hospitalId).collection('admissions');

    // Get billing data
    const billingSnapshot = await billingRef.get();
    const billings = billingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get payments data
    const paymentsSnapshot = await paymentsRef.get();
    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get admissions for revenue per admission analysis
    const admissionsSnapshot = await admissionsRef.get();
    const admissions = admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Financial calculations
    const totalRevenue = billings.reduce((sum, bill) => sum + (parseFloat(bill.totalAmount) || 0), 0);
    const totalPaid = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const totalOutstanding = totalRevenue - totalPaid;
    
    const paidBills = billings.filter(bill => bill.status === 'paid').length;
    const pendingBills = billings.filter(bill => bill.status === 'pending').length;
    const overdueBills = billings.filter(bill => bill.status === 'overdue').length;

    // Revenue by department
    const revenueByDepartment = billings.reduce((acc, bill) => {
      const dept = bill.departmentId || 'unassigned';
      acc[dept] = (acc[dept] || 0) + (parseFloat(bill.totalAmount) || 0);
      return acc;
    }, {});

    // Revenue by service type
    const revenueByService = billings.reduce((acc, bill) => {
      if (bill.services) {
        bill.services.forEach(service => {
          acc[service.name] = (acc[service.name] || 0) + (parseFloat(service.amount) || 0);
        });
      }
      return acc;
    }, {});

    // Payment methods analysis
    const paymentMethods = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod || 'unknown';
      acc[method] = (acc[method] || 0) + (parseFloat(payment.amount) || 0);
      return acc;
    }, {});

    // Monthly revenue trends
    const monthlyRevenue = billings.reduce((acc, bill) => {
      if (bill.createdAt) {
        const month = new Date(bill.createdAt).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + (parseFloat(bill.totalAmount) || 0);
      }
      return acc;
    }, {});

    // Insurance vs self-pay analysis
    const insuranceAnalysis = billings.reduce((acc, bill) => {
      if (bill.insuranceProvider) {
        acc.insurance += parseFloat(bill.totalAmount) || 0;
        acc.insuranceCount++;
      } else {
        acc.selfPay += parseFloat(bill.totalAmount) || 0;
        acc.selfPayCount++;
      }
      return acc;
    }, { insurance: 0, selfPay: 0, insuranceCount: 0, selfPayCount: 0 });

    // Average revenue per admission
    const avgRevenuePerAdmission = admissions.length > 0 ? totalRevenue / admissions.length : 0;

    const report = {
      reportType: 'Financial Performance Report',
      hospitalId,
      generatedAt: new Date().toISOString(),
      period: { startDate, endDate },
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        totalOutstanding: totalOutstanding.toFixed(2),
        collectionRate: ((totalPaid / totalRevenue) * 100).toFixed(2),
        totalBills: billings.length,
        paidBills,
        pendingBills,
        overdueBills,
        avgRevenuePerAdmission: avgRevenuePerAdmission.toFixed(2)
      },
      revenueAnalysis: {
        byDepartment: Object.entries(revenueByDepartment)
          .sort(([,a], [,b]) => b - a)
          .map(([department, revenue]) => ({ 
            department, 
            revenue: parseFloat(revenue).toFixed(2) 
          })),
        byService: Object.entries(revenueByService)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([service, revenue]) => ({ 
            service, 
            revenue: parseFloat(revenue).toFixed(2) 
          })),
        paymentMethods: Object.entries(paymentMethods)
          .map(([method, amount]) => ({ 
            method, 
            amount: parseFloat(amount).toFixed(2) 
          })),
        insuranceAnalysis: {
          insuranceRevenue: insuranceAnalysis.insurance.toFixed(2),
          selfPayRevenue: insuranceAnalysis.selfPay.toFixed(2),
          insurancePercentage: ((insuranceAnalysis.insurance / totalRevenue) * 100).toFixed(2),
          selfPayPercentage: ((insuranceAnalysis.selfPay / totalRevenue) * 100).toFixed(2)
        }
      },
      trends: {
        monthlyRevenue: Object.entries(monthlyRevenue)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, revenue]) => ({ 
            month, 
            revenue: parseFloat(revenue).toFixed(2) 
          }))
      },
      detailedData: {
        recentBills: billings.slice(0, 50),
        recentPayments: payments.slice(0, 50),
        outstandingBills: billings.filter(bill => bill.status !== 'paid').slice(0, 50)
      }
    };

    res.json({ success: true, report });

  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial report',
      error: error.message
    });
  }
};