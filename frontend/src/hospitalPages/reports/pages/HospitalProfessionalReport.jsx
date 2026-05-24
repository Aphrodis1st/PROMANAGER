import React from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';
import { useLazyGetProfessionalReportQuery } from '../../../store/actions/hospitalReports.js';

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.message || fallback;

const HospitalProfessionalReport = () => {
  const [trigger, { data: reportData, isFetching: loading, error, isError }] =
    useLazyGetProfessionalReportQuery();

  const generateReport = () => trigger();

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to generate report')
    : null;

  const downloadReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hospital-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Professional Hospital Report</h1>
        <div className="space-x-2">
          <Button onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
          {reportData && (
            <Button onClick={downloadReport} variant="outline">
              Download Report
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {errorMessage && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">Error: {errorMessage}</p>
        </Card>
      )}

      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalPatients}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Admissions</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.totalAdmissions}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">${reportData.summary.totalRevenue}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Lab Tests</h3>
              <p className="text-2xl font-bold text-orange-600">{reportData.summary.totalLabTests}</p>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Departments Overview</h3>
              <div className="space-y-2">
                <p>Total Departments: {reportData.summary.totalDepartments}</p>
                <p>Total Doctors: {reportData.summary.totalDoctors}</p>
                <p>Total Appointments: {reportData.summary.totalAppointments}</p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Medical Records</h3>
              <div className="space-y-2">
                <p>Total Records: {reportData.summary.totalMedicalRecords}</p>
                <p>Generated: {new Date(reportData.generatedAt).toLocaleString()}</p>
              </div>
            </Card>
          </div>

          {/* Data Tables */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Patients</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.details.patients.slice(0, 5).map((patient, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{patient.firstName} {patient.lastName}</td>
                      <td className="px-4 py-2">{patient.phone}</td>
                      <td className="px-4 py-2">{patient.email}</td>
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

export default HospitalProfessionalReport;