import React, { useState } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';
import { useLazyGetFinancialReportQuery } from '../../../store/actions/hospitalReports.js';

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.message || fallback;

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [trigger, { data: reportData, isFetching: loading, error, isError }] =
    useLazyGetFinancialReportQuery();

  const generateReport = () => {
    trigger({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to generate financial report')
    : null;

  const downloadReport = () => {
    if (!reportData) return;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Performance Report</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            className="border rounded px-3 py-2"
          />
          <Button onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
          {reportData && (
            <Button onClick={downloadReport} variant="outline">Download</Button>
          )}
        </div>
      </div>

      {loading && <div className="flex justify-center"><LoadingSpinner /></div>}
      {errorMessage && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">Error: {errorMessage}</p>
        </Card>
      )}

      {reportData && (
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${reportData.summary.totalRevenue}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Paid</h3>
              <p className="text-2xl font-bold text-blue-600">${reportData.summary.totalPaid}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Outstanding</h3>
              <p className="text-2xl font-bold text-red-600">${reportData.summary.totalOutstanding}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Collection Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.summary.collectionRate}%</p>
            </Card>
          </div>

          {/* Revenue Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Revenue by Department</h3>
              <div className="space-y-2">
                {reportData.revenueAnalysis.byDepartment.slice(0, 5).map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{dept.department}</span>
                    <span className="font-semibold text-green-600">${dept.revenue}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Top Services by Revenue</h3>
              <div className="space-y-2">
                {reportData.revenueAnalysis.byService.slice(0, 5).map((service, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{service.service}</span>
                    <span className="font-semibold text-blue-600">${service.revenue}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Payment Methods & Insurance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {reportData.revenueAnalysis.paymentMethods.map((method, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="capitalize">{method.method}</span>
                    <span className="font-semibold">${method.amount}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Insurance vs Self-Pay</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Insurance Revenue</span>
                  <span className="font-semibold text-blue-600">
                    ${reportData.revenueAnalysis.insuranceAnalysis.insuranceRevenue} 
                    ({reportData.revenueAnalysis.insuranceAnalysis.insurancePercentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Self-Pay Revenue</span>
                  <span className="font-semibold text-green-600">
                    ${reportData.revenueAnalysis.insuranceAnalysis.selfPayRevenue} 
                    ({reportData.revenueAnalysis.insuranceAnalysis.selfPayPercentage}%)
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Monthly Revenue Trends */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Monthly Revenue Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {reportData.trends.monthlyRevenue.slice(-12).map((month, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">{month.month}</div>
                  <div className="text-lg font-bold text-green-600">${month.revenue}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bill Status Overview */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Billing Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <div className="text-green-600 font-semibold">Paid Bills</div>
                <div className="text-2xl font-bold text-green-700">{reportData.summary.paidBills}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <div className="text-yellow-600 font-semibold">Pending Bills</div>
                <div className="text-2xl font-bold text-yellow-700">{reportData.summary.pendingBills}</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-red-600 font-semibold">Overdue Bills</div>
                <div className="text-2xl font-bold text-red-700">{reportData.summary.overdueBills}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-blue-600 font-semibold">Avg Revenue/Admission</div>
                <div className="text-2xl font-bold text-blue-700">${reportData.summary.avgRevenuePerAdmission}</div>
              </div>
            </div>
          </Card>

          {/* Recent Outstanding Bills */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Outstanding Bills</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Bill ID</th>
                    <th className="px-4 py-2 text-left">Patient</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.detailedData.outstandingBills.slice(0, 10).map((bill, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{bill.id}</td>
                      <td className="px-4 py-2">{bill.patientName || 'N/A'}</td>
                      <td className="px-4 py-2 font-semibold">${bill.totalAmount}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          bill.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;