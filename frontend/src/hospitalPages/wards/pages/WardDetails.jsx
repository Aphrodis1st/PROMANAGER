import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import DataTable from "../../../components/hospital/DataTable";
import { useWards } from "../../../hooks/useWards";

export default function WardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wards, beds, loading, fetchWards, getBedsByWard, dischargeBed } = useWards();

  useEffect(() => {
    fetchWards();
  }, []);

  const ward = useMemo(() => {
    return wards.find(w => w.id === parseInt(id));
  }, [wards, id]);

  const wardBeds = useMemo(() => {
    return getBedsByWard(id);
  }, [beds, id]);

  const handleDischarge = async (bedId, patientName) => {
    if (window.confirm(`Discharge ${patientName} from bed?`)) {
      try {
        await dischargeBed(bedId);
        alert("Patient discharged successfully");
      } catch (error) {
        alert("Failed to discharge patient");
      }
    }
  };

  const getStatusBadge = (status) => {
    return status === "Occupied" 
      ? <Badge variant="danger">Occupied</Badge>
      : <Badge variant="success">Available</Badge>;
  };

  const getConditionBadge = (condition) => {
    if (!condition) return null;
    const variants = {
      Stable: "success",
      Serious: "warning",
      Critical: "danger",
    };
    return <Badge variant={variants[condition] || "secondary"}>{condition}</Badge>;
  };

  const columns = [
    { 
      key: "bedNumber", 
      label: "Bed Number",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>{row.bedNumber}</div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => getStatusBadge(row.status)
    },
    { 
      key: "patientName", 
      label: "Patient",
      render: (row) => row.patientName ? (
        <div>
          <div style={{ fontWeight: "600" }}>{row.patientName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>ID: {row.patientId}</div>
        </div>
      ) : (
        <span style={{ color: "#9ca3af" }}>-</span>
      )
    },
    { 
      key: "condition", 
      label: "Condition",
      render: (row) => row.condition ? getConditionBadge(row.condition) : <span style={{ color: "#9ca3af" }}>-</span>
    },
    { 
      key: "admissionDate", 
      label: "Admission Date",
      render: (row) => row.admissionDate ? (
        <div>
          <div style={{ fontSize: "0.875rem" }}>{new Date(row.admissionDate).toLocaleDateString()}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {Math.floor((new Date() - new Date(row.admissionDate)) / (1000 * 60 * 60 * 24))} days
          </div>
        </div>
      ) : (
        <span style={{ color: "#9ca3af" }}>-</span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => row.status === "Occupied" ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/patients/${row.patientId}`)}>
            View Patient
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDischarge(row.id, row.patientName)}>
            Discharge
          </Button>
        </div>
      ) : (
        <Button size="sm" onClick={() => navigate(`/hospital/wards/allocation?wardId=${ward.id}`)}>
          Allocate
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <PageHeader title="Ward Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading ward details...</div>
        </Card>
      </>
    );
  }

  if (!ward) {
    return (
      <>
        <PageHeader title="Ward Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Ward not found</p>
            <Button onClick={() => navigate("/hospital/wards")} style={{ marginTop: "1rem" }}>
              Back to Wards
            </Button>
          </div>
        </Card>
      </>
    );
  }

  const occupancyRate = (ward.occupiedBeds / ward.totalBeds) * 100;

  return (
    <>
      <PageHeader 
        title={ward.name}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="secondary" onClick={() => navigate("/hospital/wards")}>
              Back to Wards
            </Button>
            <Button onClick={() => navigate(`/hospital/wards/allocation?wardId=${ward.id}`)}>
              + Allocate Bed
            </Button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Ward Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Ward Type</div>
              <Badge variant="info">{ward.type}</Badge>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Location</div>
              <div style={{ fontWeight: "600" }}>{ward.floor}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Nurse Station</div>
              <div style={{ fontWeight: "600" }}>{ward.nurseStation}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Status</div>
              <Badge variant="success">{ward.status}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Bed Statistics
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem" }}>Total Beds:</span>
              <span style={{ fontWeight: "700", fontSize: "1.125rem", color: "#3b82f6" }}>{ward.totalBeds}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem" }}>Available:</span>
              <span style={{ fontWeight: "700", fontSize: "1.125rem", color: "#10b981" }}>{ward.availableBeds}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem" }}>Occupied:</span>
              <span style={{ fontWeight: "700", fontSize: "1.125rem", color: "#ef4444" }}>{ward.occupiedBeds}</span>
            </div>
            <div style={{ marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>Occupancy Rate:</span>
                <span style={{ fontWeight: "700", color: occupancyRate >= 90 ? "#ef4444" : occupancyRate >= 75 ? "#f59e0b" : "#10b981" }}>
                  {occupancyRate.toFixed(1)}%
                </span>
              </div>
              <div style={{ 
                width: "100%", 
                height: "8px", 
                backgroundColor: "#e5e7eb", 
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  width: `${occupancyRate}%`, 
                  height: "100%", 
                  backgroundColor: occupancyRate >= 90 ? "#ef4444" : occupancyRate >= 75 ? "#f59e0b" : "#10b981",
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
          Bed Allocation
        </h3>
        {wardBeds.length > 0 ? (
          <DataTable
            columns={columns}
            data={wardBeds}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "#6b7280" }}>No bed records found for this ward.</p>
            <Button onClick={() => navigate(`/hospital/wards/allocation?wardId=${ward.id}`)} style={{ marginTop: "1rem" }}>
              Allocate First Bed
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
