import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { useWards } from "../../../hooks/useWards";

export default function BedAvailability() {
  const { wards, loading, fetchWards } = useWards();

  useEffect(() => {
    fetchWards();
  }, []);

  return (
    <>
      <PageHeader title="Bed Availability" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          wards?.map((ward) => (
            <Card key={ward.id}>
              <h3>{ward.name}</h3>
              <p><strong>Type:</strong> {ward.type}</p>
              <p><strong>Floor:</strong> {ward.floor}</p>
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#f5f5f5", borderRadius: "4px" }}>
                <p><strong>Total Beds:</strong> {ward.totalBeds}</p>
                <p style={{ color: "green" }}><strong>Available:</strong> {ward.availableBeds}</p>
                <p style={{ color: "red" }}><strong>Occupied:</strong> {ward.occupiedBeds}</p>
                <p><strong>Occupancy Rate:</strong> {((ward.occupiedBeds / ward.totalBeds) * 100).toFixed(1)}%</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
