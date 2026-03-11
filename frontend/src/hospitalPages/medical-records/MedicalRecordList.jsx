import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { usePatients } from "../../hooks/usePatients";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { useDoctors } from "../../hooks/useDoctors";

export default function MedicalRecordList() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { records, fetchRecords } = useMedicalRecords();
  const { doctors } = useDoctors();
  const [allRecords, setAllRecords] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadRecords = async () => {
      const combined = [];
      for (const patient of patients) {
        await fetchRecords(patient.id);
        const patientRecords = records.map(r => ({
          ...r,
          patientName: patient.fullName,
          patientId: patient.id
        }));
        combined.push(...patientRecords);
      }
      setAllRecords(combined);
    };
    if (patients.length > 0) loadRecords();
  }, [patients]);

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.fullName || doctor.name}` : "N/A";
  };

  const filteredRecords = allRecords.filter(r => {
    const matchesSearch = r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.recordNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: "Total Records", value: allRecords.length, color: "#3b82f6" },
    { label: "Active Patients", value: patients.length, color: "#10b981" },
    { label: "This Month", value: allRecords.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, color: "#f59e0b" },
    { label: "Doctors", value: doctors.length, color: "#8b5cf6" }
  ];

  return (
    <>
      <PageHeader
        title="Electronic Medical Records"
        action={
          <Button onClick={() => navigate("create")}>
            + Create Medical Record
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {stats.map((stat, i) => (
          <Card key={i}>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Medical Records</h3>
            <input
              type="text"
              placeholder="Search by patient or record number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                width: "300px"
              }}
            />
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <p style={{ marginBottom: "1rem" }}>No medical records found. Create one to get started.</p>
              <Button onClick={() => navigate("create")}>Create First Record</Button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Record #</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Patient Name</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Primary Doctor</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Created Date</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Last Updated</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem", fontWeight: "500", color: "#3b82f6" }}>{record.recordNumber}</td>
                      <td style={{ padding: "1rem" }}>{record.patientName}</td>
                      <td style={{ padding: "1rem" }}>{getDoctorName(record.doctorId)}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <Button size="sm" onClick={() => navigate(`/hospital/patients/${record.patientId}`)}>View</Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate(`diagnosis/${record.id}`)}>Add Diagnosis</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
