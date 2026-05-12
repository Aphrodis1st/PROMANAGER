import React, { useState } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { LoadingSpinner } from '../../../components/hospital/LoadingSpinner';

const AuditReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('hospitalToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/hospital/reports/audit`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to generate audit report');
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
        <h1 className="text-2xl font-bold">Audit & Security Report</h1>
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
              <h3 className="font-semibold text-gray-600">Total Events</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalAuditEvents}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Active Users</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.activeUsers}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Security Events</h3>
              <p className="text-2xl font-bold text-red-600">{reportData.summary.securityEvents}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-600">Critical Actions</h3>
              <p className="text-2xl font-bold text-orange-600">{reportData.summary.criticalActions}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Most Active Users</h3>
              <div className="space-y-2">
                {reportData.userActivity.mostActiveUsers.slice(0, 10).map((user, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-sm text-gray-600">{user.userRole}</div>
                    </div>
                    <span className="font-semibold">{user.totalActions}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Login Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Logins</span>
                  <span className="font-semibold">{reportData.summary.loginAnalysis.totalLogins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful Logins</span>
                  <span className="font-semibold text-green-600">{reportData.summary.loginAnalysis.successfulLogins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Logins</span>
                  <span className="font-semibold text-red-600">{reportData.summary.loginAnalysis.failedLogins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Users</span>
                  <span className="font-semibold text-blue-600">{reportData.summary.loginAnalysis.uniqueUsers}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">System Usage Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Module Access Frequency</h4>
                <div className="space-y-2">
                  {reportData.systemUsage.moduleAccess.slice(0, 8).map((module, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{module.module}</span>
                      <span className="font-semibold">{module.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Peak Activity Hours</h4>
                <div className="space-y-2">
                  {reportData.systemUsage.peakHours.map((hour, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{hour.hour}</span>
                      <span className="font-semibold">{hour.count} activities</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Compliance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded">
                <div className="text-green-600 font-semibold">User Accountability</div>
                <div className="text-xl font-bold">{reportData.security.complianceMetrics.userAccountabilityRate}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-blue-600 font-semibold">Auditable Events</div>
                <div className="text-xl font-bold">{reportData.security.complianceMetrics.totalAuditableEvents}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-purple-600 font-semibold">Critical Events Logged</div>
                <div className="text-xl font-bold">{reportData.security.complianceMetrics.criticalEventsLogged}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="text-orange-600 font-semibold">Access Violations</div>
                <div className="text-xl font-bold">{reportData.security.complianceMetrics.accessControlViolations}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Security Events</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Timestamp</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Module</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.security.securityEvents.slice(0, 10).map((event, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{new Date(event.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">{event.userId}</td>
                      <td className="px-4 py-2">{event.actionType}</td>
                      <td className="px-4 py-2">{event.module}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
                          Security Event
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

export default AuditReports;