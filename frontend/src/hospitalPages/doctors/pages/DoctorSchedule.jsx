import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { useDoctors } from "../../../hooks/useDoctors";

export default function DoctorSchedule() {
  const { id } = useParams();
  const { doctor, fetchDoctorById } = useDoctors();

  useEffect(() => {
    if (id) fetchDoctorById(id);
  }, [id]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <PageHeader title={`Schedule - Dr. ${doctor?.fullName || ""}`} />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {days.map((day) => (
            <div key={day} style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem" }}>
              <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{day}</h4>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>09:00 - 13:00</p>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>14:00 - 17:00</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
