import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useWards } from "../../../hooks/useWards";

export default function ICUManagement() {
  const navigate = useNavigate();
  const { wards, beds, loading, fetchWards, dischargeBed, getICUPatients } = useWards();

  useEffect(() => {
    fetchWards();
  }, []);

  const icuWards = useMemo(() => {
    return wards.filter(w => w.type === "ICU" || w.type === "CCU");
  }, [wards]);

  const icuPatients = useMemo(() => {
    return getICUPatients();
  }, [beds, wards]);

  const totalICUBeds = icuWards.reduce((sum, w) => sum + w.totalBeds, 0);
  const occupiedICUBeds = icuWards.reduce((sum, w) => sum + w.occupiedBeds, 0);
  const availableICUBeds = icuWards.reduce((sum, w) => sum + w.availableBeds, 0);
  const ventilatorsInUse = icuPatients.filter(p => p.ventilator).length;

  const getConditionBadge = (condition) => {
    const variants = {
      Stable: "success",
      Serious: "warning",
      Critical: "danger",
    };
    return <Badge variant={variants[condition] || "secondary"}>{condition}</Badge>;
  };

  const handleDischarge = async (bedId, patientName) => {
    if (window.confirm(`Discharge ${patientName} from ICU?`)) {
      try {
        await dischargeBed(bedId);
        alert("Patient discharged successfully");
      } catch (error) {
        alert("Failed to discharge patient");
      }
    }
  };

  const columns = [
    { 
      key: "bedNumber", 
      label: "Bed",
      render: (row) => (
        <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{row.bedNumber}</div>
      )
    },
    { 
      key: "patientName", 
      label: "Patient",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.patientName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>ID: {row.patientId}</div>
        </div>
      )
    },
    { 
      key: "condition", 
      label: "Condition",
      render: (row) => getConditionBadge(row.condition)
    },
    { 
      key: "ventilator", 
      label: "Ventilator",
      render: (row) => (
        <div style={{ textAlign: "center" }}>
          {row.ventilator ? (
            <Badge variant="danger">ON</Badge>
          ) : (
            <Badge variant="secondary">OFF</Badge>
          )}
        </div>
      )
    },
    { 
      key: "admissionDate", 
      label: "Admitted",
      render: (row) => {
        const date = new Date(row.admissionDate);
        const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        return (
          <div>
            <div style={{ fontSize: "0.875rem" }}>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{days} day(s) ago</div>
          </div>
        );
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/patients/${row.patientId}`)}>
            View Patient
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDischarge(row.id, row.patientName)}>
            Discharge
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="ICU Management" 
        action={
          <Button onClick={() => navigate("/hospital/wards/allocation")}>
            + Admit to ICU
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#3b82f6" }}>{totalICUBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total ICU Beds</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#10b981" }}>{availableICUBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Available</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#ef4444" }}>{occupiedICUBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Occupied</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#8b5cf6" }}>{ventilatorsInUse}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Ventilators in Use</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Critical Care Patients
          </h3>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading ICU patients...</div>
          ) : icuPatients.length > 0 ? (
            <DataTable 
              data={icuPatients} 
              columns={columns}
              searchable
              sortable
            />
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#6b7280" }}>No patients currently in ICU</p>
            </div>
          )}
        </Card>

        <div>
          <Card style={{ marginBottom: "1rem" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              ICU Wards
            </h4>
            {icuWards.map((ward) => (
              <div 
                key={ward.id} 
                style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "#f9fafb", 
                  borderRadius: "0.375rem",
                  marginBottom: "0.75rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: "600" }}>{ward.name}</div>
                  <Badge variant="info">{ward.type}</Badge>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  {ward.floor} - {ward.nurseStation}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span>Available:</span>
                  <span style={{ fontWeight: "600", color: ward.availableBeds > 0 ? "#10b981" : "#ef4444" }}>
                    {ward.availableBeds}/{ward.totalBeds}
                  </span>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              Patient Conditions
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Critical</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Badge variant="danger">
                    {icuPatients.filter(p => p.condition === "Critical").length}
                  </Badge>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Serious</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Badge variant="warning">
                    {icuPatients.filter(p => p.condition === "Serious").length}
                  </Badge>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Stable</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Badge variant="success">
                    {icuPatients.filter(p => p.condition === "Stable").length}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
