import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useWards } from "../../../hooks/useWards";

export default function WardList() {
  const navigate = useNavigate();
  const { wards, loading, fetchWards } = useWards();

  useEffect(() => {
    fetchWards();
  }, []);

  const columns = [
    { key: "name", label: "Ward Name" },
    { key: "type", label: "Type" },
    { key: "totalBeds", label: "Total Beds" },
    { key: "availableBeds", label: "Available" },
    { key: "occupiedBeds", label: "Occupied" },
    { key: "floor", label: "Floor" },
  ];

  return (
    <>
      <PageHeader title="Ward Management" />
      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <Button onClick={() => navigate("/hospital/wards/availability")}>
            Check Availability
          </Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={wards}
            columns={columns}
            onRowClick={(ward) => navigate(`/hospital/wards/${ward.id}`)}
          />
        )}
      </Card>
    </>
  );
}
