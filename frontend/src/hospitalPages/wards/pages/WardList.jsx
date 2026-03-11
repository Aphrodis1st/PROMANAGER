import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useWards } from "../../../hooks/useWards";

export default function WardList() {
  const navigate = useNavigate();
  const { wards, loading, fetchWards } = useWards();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchWards();
  }, []);

  const filteredWards = filter === "All" 
    ? wards 
    : wards.filter(w => w.type === filter);

  const totalBeds = wards.reduce((sum, w) => sum + w.totalBeds, 0);
  const occupiedBeds = wards.reduce((sum, w) => sum + w.occupiedBeds, 0);
  const availableBeds = wards.reduce((sum, w) => sum + w.availableBeds, 0);
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  const getOccupancyBadge = (ward) => {
    const rate = (ward.occupiedBeds / ward.totalBeds) * 100;
    if (rate >= 90) return <Badge variant="danger">{rate.toFixed(0)}%</Badge>;
    if (rate >= 75) return <Badge variant="warning">{rate.toFixed(0)}%</Badge>;
    return <Badge variant="success">{rate.toFixed(0)}%</Badge>;
  };

  const columns = [
    { 
      key: "name", 
      label: "Ward Name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{row.nurseStation}</div>
        </div>
      )
    },
    { 
      key: "type", 
      label: "Type",
      render: (row) => <Badge variant="info">{row.type}</Badge>
    },
    { key: "floor", label: "Floor" },
    { 
      key: "totalBeds", 
      label: "Total Beds",
      render: (row) => (
        <div style={{ textAlign: "center", fontWeight: "600" }}>{row.totalBeds}</div>
      )
    },
    { 
      key: "availableBeds", 
      label: "Available",
      render: (row) => (
        <div style={{ textAlign: "center", color: "#10b981", fontWeight: "600" }}>
          {row.availableBeds}
        </div>
      )
    },
    { 
      key: "occupiedBeds", 
      label: "Occupied",
      render: (row) => (
        <div style={{ textAlign: "center", color: "#ef4444", fontWeight: "600" }}>
          {row.occupiedBeds}
        </div>
      )
    },
    { 
      key: "occupancy", 
      label: "Occupancy",
      render: (row) => (
        <div style={{ textAlign: "center" }}>{getOccupancyBadge(row)}</div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/wards/${row.id}`)}>
            View Details
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/hospital/wards/allocation?wardId=${row.id}`)}>
            Allocate Bed
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Ward Management" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="secondary" onClick={() => navigate("/hospital/wards/availability")}>
              Bed Availability
            </Button>
            <Button onClick={() => navigate("/hospital/wards/allocation")}>
              + Allocate Bed
            </Button>
          </div>
        }
      />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#3b82f6" }}>{totalBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Beds</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#10b981" }}>{availableBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Available Beds</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#ef4444" }}>{occupiedBeds}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Occupied Beds</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#8b5cf6" }}>{occupancyRate}%</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Occupancy Rate</div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["All", "General", "ICU", "CCU", "Pediatric", "Maternity", "Surgical", "Orthopedic"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? "primary" : "secondary"}
              onClick={() => setFilter(type)}
            >
              {type} ({type === "All" ? wards.length : wards.filter(w => w.type === type).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading wards...</div>
        ) : filteredWards.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredWards}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No wards found.</p>
          </div>
        )}
      </Card>
    </>
  );
}
