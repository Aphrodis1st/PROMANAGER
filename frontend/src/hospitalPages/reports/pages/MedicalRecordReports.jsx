import React from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';
import { useLazyGetMedicalRecordReportQuery } from '../../../store/actions/hospitalReports.js';

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.message || fallback;

const MedicalRecordReports = () => {
  const [trigger, { data: reportData, isFetching: loading, error, isError }] =
    useLazyGetMedicalRecordReportQuery();

  const generateReport = () => trigger();

  const errorMessage = isError
    ? getErrorMessage(error, 'Failed to generate medical record report')
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Records Clinical Report</h1>
        <Button onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {loading && <div className="flex justify-center"><LoadingSpinner /></div>}
      {errorMessage && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">Error: {errorMessage}</p>
        </Card>
      )}

      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Records</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalRecords}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">With Diagnosis</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.recordsWithDiagnosis}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Completion Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.summary.completionRate}%</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Prescriptions</h3>
              <p className="text-2xl font-bold text-orange-600">{reportData.summary.totalPrescriptions}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Top Diagnoses</h3>
              <div className="space-y-2">
                {reportData.clinicalAnalytics.topDiagnoses.slice(0, 10).map((diag, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{diag.diagnosis}</span>
                    <span className="font-semibold">{diag.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Top Medications</h3>
              <div className="space-y-2">
                {reportData.clinicalAnalytics.topMedications.slice(0, 10).map((med, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{med.medication}</span>
                    <span className="font-semibold">{med.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Vital Signs Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-blue-600 font-semibold">Total Readings</div>
                <div className="text-xl font-bold">{reportData.clinicalAnalytics.vitalSignsAnalysis.totalReadings}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-green-600 font-semibold">Avg Blood Pressure</div>
                <div className="text-xl font-bold">
                  {reportData.clinicalAnalytics.vitalSignsAnalysis.averageBloodPressure.systolic.toFixed(0)}/
                  {reportData.clinicalAnalytics.vitalSignsAnalysis.averageBloodPressure.diastolic.toFixed(0)}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-purple-600 font-semibold">Avg Heart Rate</div>
                <div className="text-xl font-bold">{reportData.clinicalAnalytics.vitalSignsAnalysis.averageHeartRate.toFixed(0)} bpm</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="text-orange-600 font-semibold">Avg Temperature</div>
                <div className="text-xl font-bold">{reportData.clinicalAnalytics.vitalSignsAnalysis.averageTemperature.toFixed(1)}°F</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordReports;