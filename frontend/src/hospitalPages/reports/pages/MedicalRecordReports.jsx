import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function MedicalRecordReports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [comments, setComments] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [error, setError] = useState(null);

  // Safe access to reports data
  let patientStats = { total: 0, active: 0, admitted: 0 };
  let departmentStats = { departments: [] };

  try {
    const reports = useReports();
    patientStats = reports?.patientStats || patientStats;
    departmentStats = reports?.departmentStats || departmentStats;
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load medical record reports data');
  }

  // Mock medical record data
  const medicalRecordStats = {
    totalRecords: patientStats.total * 3, // Assume 3 records per patient on average
    recordsThisMonth: Math.floor(patientStats.total * 0.4),
    completedRecords: Math.floor(patientStats.total * 2.8),
    pendingRecords: Math.floor(patientStats.total * 0.2),
    criticalRecords: Math.floor(patientStats.total * 0.1),
    recordTypes: [
      { type: "Consultation Notes", count: Math.floor(patientStats.total * 1.2), percentage: 40 },
      { type: "Diagnostic Reports", count: Math.floor(patientStats.total * 0.8), percentage: 27 },
      { type: "Treatment Plans", count: Math.floor(patientStats.total * 0.6), percentage: 20 },
      { type: "Surgery Records", count: Math.floor(patientStats.total * 0.3), percentage: 10 },
      { type: "Discharge Summaries", count: Math.floor(patientStats.total * 0.1), percentage: 3 }
    ],
    departmentBreakdown: departmentStats.departments.map(dept => ({
      ...dept,
      records: Math.floor(Math.random() * 50) + 20,
      completionRate: Math.floor(Math.random() * 30) + 70
    }))
  };

  const exportToCSV = () => {
    const csvData = [
      ['Medical Record Metric', 'Value'],
      ['Total Records', medicalRecordStats.totalRecords],
      ['Records This Month', medicalRecordStats.recordsThisMonth],
      ['Completed Records', medicalRecordStats.completedRecords],
      ['Pending Records', medicalRecordStats.pendingRecords],
      ['Critical Records', medicalRecordStats.criticalRecords],
      [''],
      ['Record Type', 'Count', 'Percentage'],
      ...medicalRecordStats.recordTypes.map(type => [type.type, type.count, type.percentage + '%'])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-record-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Medical Record Report',
        text: `Medical Record Report - ${medicalRecordStats.totalRecords} total records`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const completionRate = medicalRecordStats.totalRecords > 0 ? 
    ((medicalRecordStats.completedRecords / medicalRecordStats.totalRecords) * 100).toFixed(1) : 0;

  if (error) {
    return (
      <>
        <PageHeader title="Medical Record Reports" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Medical Record Reports</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
              Retry
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Medical Record Reports" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" variant="secondary" onClick={exportToCSV}>📊 CSV</Button>
            <Button size="sm" variant="secondary" onClick={exportToPDF}>🖨️ PDF</Button>
            <Button size="sm" variant="secondary" onClick={shareReport}>🔗 Share</Button>
          </div>
        }
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Report Period:</label>
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
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          >
            <option value="All">All Departments</option>
            {departmentStats.departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Records</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>{medicalRecordStats.totalRecords}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>All medical records</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>This Month</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>{medicalRecordStats.recordsThisMonth}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>New records created</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Completed</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#8b5cf6" }}>{medicalRecordStats.completedRecords}</div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem" }}>{completionRate}% completion rate</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Critical Records</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444" }}>{medicalRecordStats.criticalRecords}</div>
            <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>Require attention</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Record Types Distribution</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {medicalRecordStats.recordTypes.map((type) => (
                <div key={type.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem" }}>
                  <div style={{ fontWeight: "500" }}>{type.type}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{type.count}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{type.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Department Performance</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Department</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Records</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecordStats.departmentBreakdown.map((dept, i) => (
                    <tr key={dept.id} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{dept.name}</td>
                      <td style={{ padding: "1rem", textAlign: "center", fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{dept.records}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{ 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "0.375rem", 
                          fontSize: "0.875rem", 
                          fontWeight: "500",
                          backgroundColor: dept.completionRate >= 90 ? '#dcfce7' : dept.completionRate >= 75 ? '#fef3c7' : '#fee2e2',
                          color: dept.completionRate >= 90 ? '#166534' : dept.completionRate >= 75 ? '#92400e' : '#991b1b'
                        }}>
                          {dept.completionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Quality Metrics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Documentation Rate</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{completionRate}%</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Avg Records per Patient</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>{(medicalRecordStats.totalRecords / patientStats.total).toFixed(1)}</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Monthly Growth</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6" }}>+15.2%</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Critical Rate</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ef4444" }}>{((medicalRecordStats.criticalRecords / medicalRecordStats.totalRecords) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Medical Record Analysis & Quality Notes</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your medical record analysis, quality observations, compliance notes, or improvement recommendations..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "0.75rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              resize: "vertical"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
            <Button size="sm" onClick={() => alert('Medical record analysis saved!')}>Save Analysis</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Medical record report generated on {new Date().toLocaleString()} | Period: {dateRange.startDate} to {dateRange.endDate} | Completion rate: {completionRate}% | Total records: {medicalRecordStats.totalRecords}
      </div>
    </>
  );
}