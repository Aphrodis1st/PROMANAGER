import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useDepartments } from "../../hooks/useDepartments";
import { useDoctors } from "../../hooks/useDoctors";
import { usePatients } from "../../hooks/usePatients";

export default function DepartmentStatistics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartmentById } = useDepartments();
  const { doctors } = useDoctors();
  const { patients } = usePatients();
  const [dept, setDept] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const department = getDepartmentById(parseInt(id));
    setDept(department);
    
    if (department) {
      const deptDoctors = doctors.filter(d => 
        d.department === department.name || 
        d.departmentId === parseInt(id) ||
        d.departmentId === id
      );
      
      const mockStats = {
        patientsThisMonth: Math.floor(Math.random() * 200) + 100,
        patientsLastMonth: Math.floor(Math.random() * 200) + 100,
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        consultations: Math.floor(Math.random() * 150) + 50,
        procedures: Math.floor(Math.random() * 80) + 20,
        labOrders: Math.floor(Math.random() * 300) + 100,
        bedOccupancy: Math.floor(Math.random() * 100),
        doctorWorkload: deptDoctors.map(d => ({
          name: d.fullName || d.name,
          patients: Math.floor(Math.random() * 50) + 10
        })),
        monthlyPatients: [
          { month: "Jan", count: 120 },
          { month: "Feb", count: 135 },
          { month: "Mar", count: 150 },
          { month: "Apr", count: 145 },
          { month: "May", count: 160 },
          { month: "Jun", count: 175 }
        ]
      };
      
      setStats(mockStats);
    }
  }, [id, doctors]);

  if (!dept) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Department not found</p>
        <Button onClick={() => navigate("/hospital/departments")}>Back to Departments</Button>
      </div>
    );
  }

  const maxPatients = Math.max(...(stats.doctorWorkload || []).map(d => d.patients), 1);

  return (
    <>
      <PageHeader 
        title={`${dept.name} - Department Statistics`}
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/departments/${id}`)}>
            Back to Department
          </Button>
        }
      />

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#3b82f6" }}>
              {stats.patientsThisMonth}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Patients This Month</div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem" }}>
              +{Math.round(((stats.patientsThisMonth - stats.patientsLastMonth) / stats.patientsLastMonth) * 100)}% from last month
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#10b981" }}>
              ${(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Revenue</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>This month</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#f59e0b" }}>
              {stats.consultations}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Consultations</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>This month</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#8b5cf6" }}>
              {stats.bedOccupancy}%
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Bed Occupancy</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Current</div>
          </div>
        </Card>
      </div>

      {/* Patients Per Month Chart */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>📊 Patients Per Month</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", height: "200px" }}>
          {stats.monthlyPatients?.map((item, i) => {
            const maxCount = Math.max(...stats.monthlyPatients.map(m => m.count));
            const height = (item.count / maxCount) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                  {item.count}
                </div>
                <div style={{ 
                  width: "100%", 
                  height: `${height}%`, 
                  backgroundColor: "#3b82f6", 
                  borderRadius: "0.25rem 0.25rem 0 0",
                  transition: "height 0.3s"
                }} />
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Doctor Workload */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>👨‍⚕️ Doctor Workload</h3>
          {stats.doctorWorkload && stats.doctorWorkload.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.doctorWorkload.map((doctor, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                    <span style={{ fontWeight: "500" }}>Dr. {doctor.name}</span>
                    <span style={{ color: "#6b7280" }}>{doctor.patients} patients</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#e5e7eb", borderRadius: "1rem", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${(doctor.patients / maxPatients) * 100}%`, 
                      height: "100%", 
                      backgroundColor: "#3b82f6",
                      transition: "width 0.3s"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>No doctor data available</p>
          )}
        </Card>

        {/* Bed Occupancy */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>🛏️ Bed Occupancy</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Beds</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>{dept.numberOfBeds || 40}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Occupied</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#ef4444" }}>
                {Math.round((dept.numberOfBeds || 40) * (stats.bedOccupancy / 100))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Available</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#10b981" }}>
                {(dept.numberOfBeds || 40) - Math.round((dept.numberOfBeds || 40) * (stats.bedOccupancy / 100))}
              </span>
            </div>
            <div style={{ width: "100%", height: "20px", backgroundColor: "#e5e7eb", borderRadius: "1rem", overflow: "hidden", marginTop: "0.5rem" }}>
              <div style={{ 
                width: `${stats.bedOccupancy}%`, 
                height: "100%", 
                backgroundColor: stats.bedOccupancy > 80 ? "#ef4444" : "#3b82f6",
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center" }}>
              {stats.bedOccupancy}% Occupancy
            </div>
          </div>
        </Card>
      </div>

      {/* Department Revenue */}
      <Card>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>💰 Department Revenue Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Consultations</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#3b82f6" }}>
              ${(stats.consultations * 150).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {stats.consultations} consultations @ $150
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Procedures</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#10b981" }}>
              ${(stats.procedures * 800).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {stats.procedures} procedures @ $800
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Lab Orders</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#f59e0b" }}>
              ${(stats.labOrders * 50).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {stats.labOrders} orders @ $50
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
