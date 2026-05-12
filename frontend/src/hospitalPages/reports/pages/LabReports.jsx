import React, { useState } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';

const LabReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('hospitalToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/hospital/reports/lab`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to generate lab report');
      const data = await response.json();
      setReportData(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laboratory Performance Report</h1>
        <Button onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {loading && <div className="flex justify-center"><LoadingSpinner /></div>}
      {error && <Card className="p-4 border-red-200 bg-red-50"><p className="text-red-600">Error: {error}</p></Card>}

      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Total Tests</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalTests}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Completion Rate</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.completionRate}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Avg Turnaround</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.summary.avgTurnaroundTime}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Critical Results</h3>
              <p className="text-2xl font-bold text-red-600">{reportData.summary.criticalResults}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Most Frequent Tests</h3>
              <div className="space-y-2">
                {reportData.testAnalysis.mostFrequentTests.map((test, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{test.testType}</span>
                    <span className="font-semibold">{test.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>On-time Completion</span>
                  <span className="font-semibold text-green-600">{reportData.qualityMetrics.onTimeCompletionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Test Accuracy Rate</span>
                  <span className="font-semibold text-blue-600">{reportData.qualityMetrics.testAccuracyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Notification Rate</span>
                  <span className="font-semibold text-purple-600">{reportData.qualityMetrics.criticalValueNotificationRate}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Test Result Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Test Type</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Normal Rate</th>
                    <th className="px-4 py-2 text-left">Abnormal Rate</th>
                    <th className="px-4 py-2 text-left">Critical Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.testAnalysis.resultAnalysis.slice(0, 10).map((result, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{result.testType}</td>
                      <td className="px-4 py-2">{result.total}</td>
                      <td className="px-4 py-2 text-green-600">{result.normalRate}</td>
                      <td className="px-4 py-2 text-yellow-600">{result.abnormalRate}</td>
                      <td className="px-4 py-2 text-red-600">{result.criticalRate}</td>
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

export default LabReports;