import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function HospitalReportDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(null);

  // Safe access to reports data
  let patientStats = { total: 0, newThisMonth: 0 };
  let financialStats = { monthRevenue: 0 };
  let labStats = { totalTests: 0, pending: 0, completedToday: 0 };
  let departmentStats = { total: 0, avgOccupancy: 0, totalDoctors: 0 };

  try {
    const reports = useReports();
    patientStats = reports?.patientStats || patientStats;
    financialStats = reports?.financialStats || financialStats;
    labStats = reports?.labStats || labStats;
    departmentStats = reports?.departmentStats || departmentStats;
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load reports data');
  }

  const reportCategories = [
    { 
      title: "Patient Reports", 
      path: "/hospital/reports/patient", 
      icon: "👥", 
      description: "Patient statistics and demographics",
      stats: `${patientStats.total} Total | ${patientStats.newThisMonth} New`,
      color: "#3b82f6"
    },
    { 
      title: "Medical Record Reports", 
      path: "/hospital/reports/medical-records", 
      icon: "📄", 
      description: "Medical documentation and records",
      stats: `${patientStats.total * 3} Records | 95% Complete`,
      color: "#06b6d4"
    },
    { 
      title: "Financial Reports", 
      path: "/hospital/reports/financial", 
      icon: "💰", 
      description: "Revenue and billing analytics",
      stats: `₹${financialStats.monthRevenue.toLocaleString()} This Month`,
      color: "#10b981"
    },
    { 
      title: "Department Reports", 
      path: "/hospital/reports/department", 
      icon: "🏥", 
      description: "Department performance metrics",
      stats: `${departmentStats.total} Departments | ${departmentStats.avgOccupancy}% Avg Occupancy`,
      color: "#f59e0b"
    },
    { 
      title: "Lab Reports", 
      path: "/hospital/reports/lab", 
      icon: "🔬", 
      description: "Laboratory test statistics",
      stats: `${labStats.totalTests} Tests | ${labStats.pending} Pending`,
      color: "#8b5cf6"
    },
    { 
      title: "Audit Logs", 
      path: "/hospital/reports/audit", 
      icon: "📋", 
      description: "System activity and changes",
      stats: "Real-time monitoring",
      color: "#ef4444"
    },
  ];

  const quickStats = [
    { label: "Total Patients", value: patientStats.total, color: "#3b82f6" },
    { label: "Monthly Revenue", value: `₹${financialStats.monthRevenue.toLocaleString()}`, color: "#10b981" },
    { label: "Active Doctors", value: departmentStats.totalDoctors, color: "#f59e0b" },
    { label: "Lab Tests Today", value: labStats.completedToday, color: "#8b5cf6" }
  ];

  if (error) {
    return (
      <>
        <PageHeader title="Hospital Reports Dashboard" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Reports</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
              Retry
            </Button>
          </div>
        </Card>
      </>
    );
  }

  const exportReport = (type) => {
    const data = {
      patients: patientStats,
      financial: financialStats,
      departments: departmentStats,
      lab: labStats,
      dateRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <>
      <PageHeader 
        title="Hospital Reports Dashboard" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" variant="secondary" onClick={() => exportReport('comprehensive')}>📊 Export All</Button>
            <Button size="sm" variant="secondary" onClick={printReport}>🖨️ Print</Button>
          </div>
        }
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Date Range:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {quickStats.map((stat, i) => (
          <Card key={i}>
            <div style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {reportCategories.map((category) => (
          <Card key={category.path} style={{ cursor: "pointer", transition: "transform 0.2s", ":hover": { transform: "translateY(-2px)" } }}>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ fontSize: "2rem", marginRight: "1rem" }}>{category.icon}</div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem", color: category.color }}>{category.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>{category.description}</p>
                </div>
              </div>
              
              <div style={{ 
                padding: "0.75rem", 
                backgroundColor: "#f9fafb", 
                borderRadius: "0.375rem", 
                marginBottom: "1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151"
              }}>
                {category.stats}
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button onClick={() => navigate(category.path)} style={{ flex: 1 }}>
                  View Report
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    exportReport(category.title.toLowerCase().split(' ')[0]);
                  }}
                >
                  📊
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: "1.5rem" }}>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Activity Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>{patientStats.newThisMonth}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>New Patients This Month</div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{financialStats.paidInvoices}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Invoices Paid</div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#fefce8", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{labStats.completedToday}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Lab Tests Completed Today</div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#fdf2f8", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ec4899" }}>{labStats.critical}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Critical Results</div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
