import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';

const PatientReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

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
        endDate: dateRange.endDate
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/hospital/reports/patients?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to generate patient report`);
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
    link.download = `patient-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Analytics Report</h1>
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
      {error && <Card className="p-4 border-red-200 bg-red-50"><p className="text-red-600">Error: {error}</p></Card>}

      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.executiveSummary?.totalPatients || 0}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Active Patients</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.executiveSummary?.activePatients || 0}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Average Age</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.executiveSummary?.averageAge ? reportData.executiveSummary.averageAge.toFixed(1) : 0} years</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Admissions</h3>
              <p className="text-2xl font-bold text-orange-600">{reportData.executiveSummary?.totalAdmissions || 0}</p>
            </Card>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Age Distribution</h3>
              <div className="space-y-2">
                {reportData.demographics?.ageDistribution && Object.entries(reportData.demographics.ageDistribution).map(([age, count]) => (
                  <div key={age} className="flex justify-between">
                    <span>{age} years</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Gender Distribution</h3>
              <div className="space-y-2">
                {reportData.demographics?.genderDistribution && Object.entries(reportData.demographics.genderDistribution).map(([gender, count]) => (
                  <div key={gender} className="flex justify-between">
                    <span className="capitalize">{gender}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Department Distribution */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Department-wise Patient Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportData.demographics?.departmentDistribution && Object.entries(reportData.demographics.departmentDistribution).map(([dept, count]) => (
                <div key={dept} className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">{dept}</div>
                  <div className="text-xl font-bold text-blue-600">{count} patients</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Patients */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Patients</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Age</th>
                    <th className="px-4 py-2 text-left">Gender</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.detailedData?.recentPatients && reportData.detailedData.recentPatients.slice(0, 10).map((patient, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.age}</td>
                      <td className="px-4 py-2 capitalize">{patient.gender || 'N/A'}</td>
                      <td className="px-4 py-2">{patient.phone}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status || 'Unknown'}
                        </span>
                      </td>
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

export default PatientReports;