import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useWards } from "../../../hooks/useWards";

export default function BedAvailability() {
  const navigate = useNavigate();
  const { wards, loading, fetchWards } = useWards();
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchWards();
  }, []);

  const filteredWards = selectedType === "All" 
    ? wards 
    : wards.filter(w => w.type === selectedType);

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "#ef4444";
    if (rate >= 75) return "#f59e0b";
    if (rate >= 50) return "#3b82f6";
    return "#10b981";
  };

  const getStatusBadge = (availableBeds) => {
    if (availableBeds === 0) return <Badge variant="danger">Full</Badge>;
    if (availableBeds <= 3) return <Badge variant="warning">Limited</Badge>;
    return <Badge variant="success">Available</Badge>;
  };

  return (
    <>
      <PageHeader 
        title="Bed Availability Dashboard" 
        action={
          <Button onClick={() => navigate("/hospital/wards/allocation")}>
            + Allocate Bed
          </Button>
        }
      />

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["All", "General", "ICU", "CCU", "Pediatric", "Maternity", "Surgical", "Orthopedic"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "primary" : "secondary"}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading bed availability...</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem" }}>
          {filteredWards.map((ward) => {
            const occupancyRate = (ward.occupiedBeds / ward.totalBeds) * 100;
            const occupancyColor = getOccupancyColor(occupancyRate);

            return (
              <Card key={ward.id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                  {getStatusBadge(ward.availableBeds)}
                </div>

                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  {ward.name}
                </h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Badge variant="info">{ward.type}</Badge>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{ward.floor}</span>
                </div>

                <div style={{ 
                  padding: "1rem", 
                  backgroundColor: "#f9fafb", 
                  borderRadius: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
                        {ward.totalBeds}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Total</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
                        {ward.availableBeds}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Available</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444" }}>
                        {ward.occupiedBeds}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Occupied</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>Occupancy Rate</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: occupancyColor }}>
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
                      backgroundColor: occupancyColor,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>

                <div style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "#f0f9ff", 
                  borderRadius: "0.375rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                    Nurse Station
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    {ward.nurseStation}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/hospital/wards/${ward.id}`)}
                    style={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => navigate(`/hospital/wards/allocation?wardId=${ward.id}`)}
                    disabled={ward.availableBeds === 0}
                    style={{ flex: 1 }}
                  >
                    Allocate Bed
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filteredWards.length === 0 && (
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No wards found for the selected type.</p>
          </div>
        </Card>
      )}
    </>
  );
}
