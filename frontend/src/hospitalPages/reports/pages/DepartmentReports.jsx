import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function DepartmentReports() {
  const { departmentStats } = useReports();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [comments, setComments] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const exportToCSV = () => {
    const csvData = [
      ['Department', 'Patients', 'Doctors', 'Appointments', 'Revenue (₹)', 'Occupancy (%)'],
      ...departmentStats.departments.map(dept => [
        dept.name,
        dept.patients,
        dept.doctors,
        dept.appointments,
        dept.revenue,
        dept.occupancy
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `department-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Department Performance Report',
        text: `Department Report - ${departmentStats.total} departments, ${departmentStats.avgOccupancy}% avg occupancy`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const sortedDepartments = [...departmentStats.departments].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const topPerformers = {
    revenue: sortedDepartments.sort((a, b) => b.revenue - a.revenue).slice(0, 3),
    patients: sortedDepartments.sort((a, b) => b.patients - a.patients).slice(0, 3),
    occupancy: sortedDepartments.sort((a, b) => b.occupancy - a.occupancy).slice(0, 3)
  };

  return (
    <>
      <PageHeader 
        title="Department Performance Reports" 
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
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Departments</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>{departmentStats.total}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Active departments</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Active Doctors</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>{departmentStats.totalDoctors}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Across all departments</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Patients</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>{departmentStats.totalPatients}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Under treatment</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Avg Occupancy</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#8b5cf6" }}>{departmentStats.avgOccupancy}%</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Hospital-wide average</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Top Revenue Generators</h3>
            {topPerformers.revenue.map((dept, i) => (
              <div key={dept.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < 2 ? "1px solid #e5e7eb" : "none" }}>
                <div>
                  <div style={{ fontWeight: "500" }}>{dept.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{dept.patients} patients</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#10b981" }}>₹{dept.revenue.toLocaleString()}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>#{i + 1} rank</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Highest Patient Volume</h3>
            {topPerformers.patients.map((dept, i) => (
              <div key={dept.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < 2 ? "1px solid #e5e7eb" : "none" }}>
                <div>
                  <div style={{ fontWeight: "500" }}>{dept.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{dept.doctors} doctors</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{dept.patients}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>patients</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#374151" }}>Department Performance Matrix</h3>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Click column headers to sort</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('name')}
                  >
                    Department {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('patients')}
                  >
                    Patients {sortBy === 'patients' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('doctors')}
                  >
                    Doctors {sortBy === 'doctors' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('appointments')}
                  >
                    Appointments {sortBy === 'appointments' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('revenue')}
                  >
                    Revenue (₹) {sortBy === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    onClick={() => handleSort('occupancy')}
                  >
                    Occupancy (%) {sortBy === 'occupancy' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedDepartments.map((dept, i) => {
                  const performanceScore = Math.round((dept.occupancy + (dept.revenue / 1000) + dept.patients) / 3);
                  const performanceColor = performanceScore >= 80 ? '#10b981' : performanceScore >= 60 ? '#f59e0b' : '#ef4444';
                  
                  return (
                    <tr key={dept.id} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{dept.name}</td>
                      <td style={{ padding: "1rem", textAlign: "center", fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{dept.patients}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{dept.doctors}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{dept.appointments}</td>
                      <td style={{ padding: "1rem", textAlign: "right", fontSize: "1.125rem", fontWeight: "600", color: "#10b981" }}>₹{dept.revenue.toLocaleString()}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{ 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "0.375rem", 
                          fontSize: "0.875rem", 
                          fontWeight: "500",
                          backgroundColor: dept.occupancy >= 80 ? '#dcfce7' : dept.occupancy >= 60 ? '#fef3c7' : '#fee2e2',
                          color: dept.occupancy >= 80 ? '#166534' : dept.occupancy >= 60 ? '#92400e' : '#991b1b'
                        }}>
                          {dept.occupancy}%
                        </span>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          borderRadius: "50%", 
                          backgroundColor: performanceColor, 
                          color: "white", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontWeight: "600",
                          margin: "0 auto"
                        }}>
                          {performanceScore}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Department Analysis & Recommendations</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your department performance analysis, observations, recommendations, or action items..."
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
            <Button size="sm" onClick={() => alert('Department analysis saved!')}>Save Analysis</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Department performance report generated on {new Date().toLocaleString()} | Period: {dateRange.startDate} to {dateRange.endDate} | Average occupancy: {departmentStats.avgOccupancy}%
      </div>
    </>
  );
}
