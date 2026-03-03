import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import { useAdmissions } from "../../hooks/useAdmissions";

export default function AdmissionList() {
  const { admissions } = useAdmissions();

  return (
    <>
      <PageHeader title="Hospital Admissions" />
      <Card>
        <DataTable
          columns={[
            { key: "patientName", label: "Patient" },
            { key: "ward", label: "Ward" },
            { key: "bed", label: "Bed" },
            { key: "admitDate", label: "Admitted On" },
            { key: "status", label: "Status" },
          ]}
          data={admissions}
          searchable
          pagination
        />
      </Card>
    </>
  );
}
