import React, { useState } from 'react';
import { Card } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import PatientReports from './PatientReports';
import FinancialReports from './FinancialReports';
import DepartmentReports from './DepartmentReports';
import MedicalRecordReports from './MedicalRecordReports';
import LabReports from './LabReports';
import AuditReports from './AuditReports';
import DashboardOverviewReport from './DashboardOverviewReport';

const HospitalReportDashboard = () => {
  const [activeReport, setActiveReport] = useState('main');

  const reportTypes = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: '📊', description: 'Complete hospital performance overview' },
    { id: 'patients', name: 'Patient Reports', icon: '👥', description: 'Patient demographics and analytics' },
    { id: 'medical', name: 'Medical Records', icon: '📋', description: 'Clinical data and medical analytics' },
    { id: 'financial', name: 'Financial Reports', icon: '💰', description: 'Revenue, billing, and financial performance' },
    { id: 'departments', name: 'Department Reports', icon: '🏥', description: 'Individual department performance' },
    { id: 'lab', name: 'Lab Reports', icon: '🔬', description: 'Laboratory tests and results analytics' },
    { id: 'audit', name: 'Audit & Logs', icon: '🔍', description: 'System activity and security reports' }
  ];

  const renderActiveReport = () => {
    switch (activeReport) {
      case 'dashboard':
        return <DashboardOverviewReport />;
      case 'patients':
        return <PatientReports />;
      case 'medical':
        return <MedicalRecordReports />;
      case 'financial':
        return <FinancialReports />;
      case 'departments':
        return <DepartmentReports />;
      case 'lab':
        return <LabReports />;
      case 'audit':
        return <AuditReports />;
      default:
        return <DashboardOverviewReport />;
    }
  };

  if (activeReport !== 'main') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setActiveReport('main')} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Reports</span>
            </Button>
            <h1 className="text-xl font-semibold">
              {reportTypes.find(r => r.id === activeReport)?.name}
            </h1>
          </div>
        </div>
        <div className="p-6">
          {renderActiveReport()}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Hospital Reports Dashboard</h1>
        <p className="text-gray-600">Generate comprehensive professional reports for all hospital operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-sm text-gray-600">Available Reports</div>
          <div className="text-2xl font-bold text-blue-600">{reportTypes.length}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm text-gray-600">Real-time Data</div>
          <div className="text-2xl font-bold text-green-600">Live</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm text-gray-600">Export Formats</div>
          <div className="text-2xl font-bold text-purple-600">JSON</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-sm text-gray-600">Security</div>
          <div className="text-2xl font-bold text-orange-600">Secure</div>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card 
            key={report.id} 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
            onClick={() => setActiveReport(report.id)}
          >
            <div className="text-center space-y-4">
              <div className="text-4xl">{report.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{report.name}</h3>
              <p className="text-gray-600 text-sm">{report.description}</p>
              <Button className="w-full">
                Generate Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Report Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="text-2xl">📅</div>
            <div className="font-semibold">Date Range Filtering</div>
            <div className="text-sm text-gray-600">Custom date ranges for all reports</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl">📊</div>
            <div className="font-semibold">Visual Analytics</div>
            <div className="text-sm text-gray-600">Charts and graphs for data visualization</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl">💾</div>
            <div className="font-semibold">Export Options</div>
            <div className="text-sm text-gray-600">Download reports in multiple formats</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl">🔄</div>
            <div className="font-semibold">Real-time Updates</div>
            <div className="text-sm text-gray-600">Live data from hospital systems</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Set initial state to show main dashboard
export default HospitalReportDashboard;