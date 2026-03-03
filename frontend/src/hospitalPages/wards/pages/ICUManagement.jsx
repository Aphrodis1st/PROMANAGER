import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import { useWards } from "../../../hooks/useWards";

export default function ICUManagement() {
  const { icuPatients, loading, fetchICUPatients } = useWards();

  useEffect(() => {
    fetchICUPatients();
  }, []);

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "bedNumber", label: "Bed" },
    { key: "condition", label: "Condition" },
    { key: "ventilator", label: "Ventilator" },
    { key: "admissionDate", label: "Admitted" },
    { key: "attendingDoctor", label: "Doctor" },
  ];

  return (
    <>
      <PageHeader title="ICU Management" />
      <Card>
        <h3>Critical Care Patients</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable data={icuPatients || []} columns={columns} />
        )}
      </Card>
    </>
  );
}
