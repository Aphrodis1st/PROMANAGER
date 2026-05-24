import React, { useState } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';
import { useLazyGetDashboardReportQuery } from '../../../store/actions/hospitalReports.js';

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.message || fallback;

const DashboardOverviewReport = () => {
  const [period, setPeriod] = useState('30');
  const [trigger, { data: reportData, isFetching: loading, error, isError }] =
    useLazyGetDashboardReportQuery();

  const generateReport = () => trigger({ period });

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to generate dashboard report')
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hospital Dashboard Overview</h1>
        <div className="flex space-x-4">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
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
          {/* Key Performance Indicators */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-blue-600 font-semibold">Total Patients</div>
                <div className="text-2xl font-bold text-blue-700">{reportData.kpis.totalPatients}</div>
                <div className="text-sm text-blue-600">+{reportData.kpis.newPatientsThisPeriod} new</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-green-600 font-semibold">Total Revenue</div>
                <div className="text-2xl font-bold text-green-700">${reportData.kpis.totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-green-600">${reportData.kpis.revenueThisPeriod.toFixed(2)} this period</div>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-purple-600 font-semibold">Appointments</div>
                <div className="text-2xl font-bold text-purple-700">{reportData.kpis.totalAppointments}</div>
                <div className="text-sm text-purple-600">{reportData.kpis.appointmentsToday} today</div>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <div className="text-orange-600 font-semibold">Current Admissions</div>
                <div className="text-2xl font-bold text-orange-700">{reportData.kpis.currentAdmissions}</div>
                <div className="text-sm text-orange-600">{reportData.kpis.totalAdmissions} total</div>
              </div>
            </div>
          </Card>

          {/* Growth Rates */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Growth Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.growthRates.patientGrowth}%</div>
                <div className="text-gray-600">Patient Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reportData.growthRates.revenueGrowth}%</div>
                <div className="text-gray-600">Revenue Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{reportData.growthRates.appointmentGrowth}%</div>
                <div className="text-gray-600">Appointment Growth</div>
              </div>
            </div>
          </Card>

          {/* Efficiency Metrics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Operational Efficiency</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{reportData.efficiency.bedOccupancyRate}</div>
                <div className="text-sm text-gray-600">Bed Occupancy</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{reportData.efficiency.appointmentUtilization}</div>
                <div className="text-sm text-gray-600">Appointment Utilization</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{reportData.efficiency.labTestCompletionRate}</div>
                <div className="text-sm text-gray-600">Lab Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{reportData.efficiency.averageWaitTime}</div>
                <div className="text-sm text-gray-600">Avg Wait Time</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-600">{reportData.efficiency.patientSatisfactionScore}</div>
                <div className="text-sm text-gray-600">Patient Satisfaction</div>
              </div>
            </div>
          </Card>

          {/* Department Performance */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Performing Departments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Appointments</th>
                    <th className="px-4 py-2 text-left">Revenue</th>
                    <th className="px-4 py-2 text-left">Doctors</th>
                    <th className="px-4 py-2 text-left">Avg Revenue/Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.departmentPerformance.map((dept, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{dept.departmentName}</td>
                      <td className="px-4 py-2">{dept.totalAppointments}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">${dept.totalRevenue}</td>
                      <td className="px-4 py-2">{dept.totalDoctors}</td>
                      <td className="px-4 py-2">${dept.avgRevenuePerAppointment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Alerts and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>Critical Lab Results</span>
                  <span className="font-bold text-red-600">{reportData.alerts.criticalLabResults}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>Overdue Bills</span>
                  <span className="font-bold text-yellow-600">{reportData.alerts.overdueBills}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Pending Appointments</span>
                  <span className="font-bold text-blue-600">{reportData.alerts.pendingAppointments}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Today's Appointments</span>
                  <span className="font-semibold">{reportData.quickStats.todayAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Admissions</span>
                  <span className="font-semibold">{reportData.quickStats.currentAdmissions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Lab Tests</span>
                  <span className="font-semibold">{reportData.quickStats.pendingLabTests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Revenue</span>
                  <span className="font-semibold text-green-600">${reportData.quickStats.todayRevenue}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverviewReport;