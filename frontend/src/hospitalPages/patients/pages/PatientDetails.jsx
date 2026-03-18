import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { usePatients } from "../../../hooks/usePatients";
import { useBilling } from "../../../hooks/useBilling";
import { useAppointments } from "../../../hooks/useAppointments";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { insuranceProviders } = useBilling();
  const { appointments } = useAppointments();
  const { records, fetchRecords } = useMedicalRecords();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const found = patients?.find(p => p.id === id);
    setPatient(found);
    if (found) {
      fetchRecords(id);
    }
  }, [id, patients]);

  const patientAppointments = appointments?.filter(a => a.patientId === id) || [];
  const patientRecords = records || [];

  const getInsuranceProviderName = (providerId) => {
    if (!providerId) return "No Insurance";
    const provider = insuranceProviders.find(p => p.id === providerId);
    return provider ? provider.name : "Unknown Provider";
  };

  if (!patient) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading patient details...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title={`Patient Details - ${patient.fullName}`}
        subtitle={`Patient ID: ${patient.patientId || patient.id}`}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => navigate(`/hospital/patients/${id}/edit`)}>
              Edit Patient
            </Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/patients")}>
              Back to List
            </Button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Personal Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Personal Information
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Full Name</div>
              <div style={{ fontWeight: "600" }}>{patient.fullName || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Gender</div>
              <div style={{ fontWeight: "600" }}>{patient.gender || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Date of Birth</div>
              <div style={{ fontWeight: "600" }}>{patient.dateOfBirth || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Age</div>
              <div style={{ fontWeight: "600" }}>
                {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : patient.age || 'N/A'} years
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Blood Group</div>
              <div style={{ fontWeight: "600" }}>{patient.bloodGroup || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Marital Status</div>
              <div style={{ fontWeight: "600" }}>{patient.maritalStatus || 'N/A'}</div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Contact Information
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Primary Phone</div>
              <div style={{ fontWeight: "600" }}>{patient.phone || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Alternate Phone</div>
              <div style={{ fontWeight: "600" }}>{patient.alternatePhone || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Email</div>
              <div style={{ fontWeight: "600" }}>{patient.email || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Address</div>
              <div style={{ fontWeight: "600" }}>{patient.address || 'N/A'}</div>
            </div>
          </div>
        </Card>

        {/* Insurance Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Insurance Information
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Provider</div>
              <div style={{ fontWeight: "600" }}>
                {getInsuranceProviderName(patient.insuranceInfo?.providerId)}
              </div>
            </div>
            {patient.insuranceInfo?.providerId && (
              <>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Policy Number</div>
                  <div style={{ fontWeight: "600" }}>{patient.insuranceInfo.policyNumber || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Group Number</div>
                  <div style={{ fontWeight: "600" }}>{patient.insuranceInfo.groupNumber || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Copay</div>
                  <div style={{ fontWeight: "600" }}>${patient.insuranceInfo.copayAmount || '0.00'}</div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Emergency Contact
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</div>
              <div style={{ fontWeight: "600" }}>{patient.emergencyContact?.name || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</div>
              <div style={{ fontWeight: "600" }}>{patient.emergencyContact?.phone || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Relationship</div>
              <div style={{ fontWeight: "600" }}>{patient.emergencyContact?.relationship || 'N/A'}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <Button 
            onClick={() => navigate(`/hospital/patients/${id}/vital-signs`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>🩺</span>
            Record Vital Signs
          </Button>
          
          <Button 
            onClick={() => navigate(`/hospital/appointments/create?patientId=${id}`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>📅</span>
            Book Appointment
          </Button>
          
          <Button 
            onClick={() => navigate(`/hospital/lab/create?patientId=${id}`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>🧪</span>
            Order Lab Tests
          </Button>
          
          <Button 
            onClick={() => navigate(`/hospital/medical-records/create?patientId=${id}`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>📋</span>
            Create Medical Record
          </Button>
          
          <Button 
            onClick={() => navigate(`/hospital/patients/${id}/history`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>📊</span>
            View History
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => navigate(`/hospital/reports/medical-records`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>📈</span>
            Medical Analytics
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => navigate(`/hospital/billing/create?patientId=${id}`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}
          >
            <span style={{ fontSize: "1.25rem" }}>💰</span>
            Create Invoice
          </Button>
        </div>
      </Card>

      {/* Medical Information */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Medical Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Allergies</div>
            <div style={{ fontWeight: "600" }}>{patient.medicalInfo?.allergies || 'None reported'}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Current Medications</div>
            <div style={{ fontWeight: "600" }}>{patient.medicalInfo?.currentMedications || 'None reported'}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Medical Conditions</div>
            <div style={{ fontWeight: "600" }}>{patient.medicalInfo?.medicalConditions || 'None reported'}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Primary Physician</div>
            <div style={{ fontWeight: "600" }}>{patient.medicalInfo?.primaryPhysician || 'Not assigned'}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient Type</div>
            <Badge variant={patient.medicalInfo?.patientType === "Emergency" ? "danger" : "info"}>
              {patient.medicalInfo?.patientType || 'Outpatient'}
            </Badge>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Preferred Language</div>
            <div style={{ fontWeight: "600" }}>{patient.medicalInfo?.preferredLanguage || 'English'}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Recent Appointments */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>
              Recent Appointments
            </h3>
            <Button size="sm" onClick={() => navigate(`/hospital/appointments/create?patientId=${id}`)}>
              + New
            </Button>
          </div>
          {patientAppointments.length > 0 ? (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {patientAppointments.slice(0, 3).map(apt => (
                <div key={apt.id} style={{ padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600" }}>{apt.doctorName || 'Dr. TBD'}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {apt.date} at {apt.time}
                      </div>
                    </div>
                    <Badge variant={apt.status === 'Completed' ? 'success' : 'info'}>
                      {apt.status || 'Scheduled'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              No appointments found
            </div>
          )}
        </Card>

        {/* Medical Records */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>
              Medical Records
            </h3>
            <Button size="sm" onClick={() => navigate(`/hospital/medical-records/create?patientId=${id}`)}>
              + New
            </Button>
          </div>
          {patientRecords.length > 0 ? (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {patientRecords.slice(0, 3).map(record => (
                <div key={record.id} style={{ padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600" }}>Record #{record.recordNumber || record.id}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {record.primaryDoctor || 'Dr. TBD'}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/hospital/medical-records/${record.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              No medical records found
            </div>
          )}
        </Card>
      </div>
    </>
  );
}