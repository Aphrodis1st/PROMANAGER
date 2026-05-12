import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';

const DepartmentReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('hospitalToken') || localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/hospital/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('hospitalToken') || localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        ...(selectedDepartment && { departmentId: selectedDepartment })
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/hospital/reports/departments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to generate department report`);
      }
      
      const data = await response.json();
      if (data.success && data.report) {
        setReportData(data.report);
      } else {
        throw new Error('Invalid report data received');
      }
    } catch (err) {
      console.error('Report generation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `department-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const renderDepartmentCard = (dept) => (
    <Card key={dept.departmentId} className="p-6 space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-xl font-bold text-blue-600">{dept.departmentName}</h3>
        <p className="text-gray-600">Head: {dept.departmentHead || 'Not assigned'}</p>
      </div>

      {/* Department Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-blue-600 font-semibold">Total Doctors</div>
          <div className="text-2xl font-bold text-blue-700">{dept.summary.totalDoctors}</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-green-600 font-semibold">Appointments</div>
          <div className="text-2xl font-bold text-green-700">{dept.summary.totalAppointments}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-purple-600 font-semibold">Revenue</div>
          <div className="text-2xl font-bold text-purple-700">${dept.summary.totalRevenue}</div>
        </div>
        <div className="bg-orange-50 p-3 rounded">
          <div className="text-orange-600 font-semibold">Admissions</div>
          <div className="text-2xl font-bold text-orange-700">{dept.summary.totalAdmissions}</div>
        </div>
        <div className="bg-indigo-50 p-3 rounded">
          <div className="text-indigo-600 font-semibold">Avg Revenue/Patient</div>
          <div className="text-2xl font-bold text-indigo-700">${dept.summary.avgRevenuePerPatient}</div>
        </div>
        <div className="bg-pink-50 p-3 rounded">
          <div className="text-pink-600 font-semibold">Occupancy Rate</div>
          <div className="text-2xl font-bold text-pink-700">{dept.summary.occupancyRate}%</div>
        </div>
      </div>

      {/* Doctor Performance */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Doctor Performance</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Specialization</th>
                <th className="px-4 py-2 text-left">Appointments</th>
                <th className="px-4 py-2 text-left">Revenue</th>
                <th className="px-4 py-2 text-left">Avg/Appointment</th>
              </tr>
            </thead>
            <tbody>
              {dept.performance.doctorPerformance.slice(0, 5).map((doctor, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 font-medium">{doctor.doctorName}</td>
                  <td className="px-4 py-2">{doctor.specialization}</td>
                  <td className="px-4 py-2">{doctor.totalAppointments}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">${doctor.totalRevenue}</td>
                  <td className="px-4 py-2">${doctor.avgRevenuePerAppointment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Services */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Top Services by Revenue</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dept.performance.topServices.map((service, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <span>{service.service}</span>
              <span className="font-semibold text-green-600">${service.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">Monthly Appointments</h4>
          <div className="space-y-2">
            {dept.trends.monthlyAppointments.slice(-6).map((month, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{month.month}</span>
                <span className="font-semibold">{month.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3">Monthly Revenue</h4>
          <div className="space-y-2">
            {dept.trends.monthlyRevenue.slice(-6).map((month, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{month.month}</span>
                <span className="font-semibold text-green-600">${month.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Department Performance Reports</h1>
        <div className="flex space-x-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded px-3 py-2 min-w-48"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
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
      {error && <Card className="p-4 border-red-200 bg-red-50"><p className="text-red-600">Error: {error}</p></Card>}

      {reportData && (
        <div className="space-y-6">
          {/* Report Header */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">{reportData.reportType}</h2>
            <p className="text-gray-600">Generated on: {reportData.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : new Date().toLocaleString()}</p>
            <p className="text-gray-600">Period: {reportData.period?.startDate || dateRange.startDate} to {reportData.period?.endDate || dateRange.endDate}</p>
          </Card>

          {/* Department Data */}
          {Array.isArray(reportData.departmentData) ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">All Departments Overview</h2>
              {reportData.departmentData.map(dept => renderDepartmentCard(dept))}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Individual Department Report</h2>
              {renderDepartmentCard(reportData.departmentData)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentReports;