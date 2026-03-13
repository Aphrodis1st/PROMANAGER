import React from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { usePatients } from "../../../hooks/usePatients";
import { useBilling } from "../../../hooks/useBilling";
import { useNavigate } from "react-router-dom";

export default function PatientList() {
  const { patients, loading } = usePatients();
  const { insuranceProviders } = useBilling();
  const navigate = useNavigate();

  const getInsuranceProviderName = (providerId) => {
    if (!providerId) return "No Insurance";
    const provider = insuranceProviders.find(p => p.id === providerId);
    return provider ? provider.name : "Unknown Provider";
  };

  const columns = [
    { 
      key: "patientId", 
      label: "Patient ID",
      render: (row) => (
        <div style={{ fontWeight: "600", color: "#3b82f6" }}>
          {row.patientId || `P${String(row.id).slice(-4).toUpperCase()}`}
        </div>
      )
    },
    { 
      key: "fullName", 
      label: "Patient Name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.fullName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {row.gender} • {row.age || 'N/A'} years
          </div>
        </div>
      )
    },
    { 
      key: "contact", 
      label: "Contact Info",
      render: (row) => (
        <div>
          <div style={{ fontSize: "0.875rem" }}>{row.phone}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{row.email}</div>
        </div>
      )
    },
    { 
      key: "insurance", 
      label: "Insurance",
      render: (row) => {
        const hasInsurance = row.insuranceInfo?.providerId;
        return (
          <div>
            <Badge variant={hasInsurance ? "success" : "secondary"}>
              {hasInsurance ? "Insured" : "Uninsured"}
            </Badge>
            {hasInsurance && (
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                {getInsuranceProviderName(row.insuranceInfo.providerId)}
              </div>
            )}
          </div>
        );
      }
    },
    { 
      key: "patientType", 
      label: "Type",
      render: (row) => {
        const type = row.medicalInfo?.patientType || "Outpatient";
        const variant = type === "Emergency" ? "danger" : 
                      type === "Inpatient" ? "warning" : "info";
        return <Badge variant={variant}>{type}</Badge>;
      }
    },
    { 
      key: "actions", 
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button 
            size="sm" 
            onClick={() => navigate(`/hospital/patients/${row.id}`)}
          >
            View
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => navigate(`/hospital/patients/${row.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      )
    },
  ];

  const stats = {
    total: patients?.length || 0,
    insured: patients?.filter(p => p.insuranceInfo?.providerId).length || 0,
    emergency: patients?.filter(p => p.medicalInfo?.patientType === "Emergency").length || 0,
    inpatient: patients?.filter(p => p.medicalInfo?.patientType === "Inpatient").length || 0
  };

  return (
    <>
      <PageHeader
        title="Patient Management"
        subtitle="Comprehensive patient registry and management system"
        action={
          <Button onClick={() => navigate("/hospital/patients/create")}>
            + Register New Patient
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              {stats.total}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Patients</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              {stats.insured}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Insured Patients</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
              {stats.emergency}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Emergency Cases</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>
              {stats.inpatient}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Inpatients</div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>
            Patient Registry
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
            Complete list of all registered patients with insurance and medical information
          </p>
        </div>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
            Loading patients...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={patients || []}
            searchable
            sortable
            pagination
            pageSize={10}
          />
        )}
      </Card>
    </>
  );
}