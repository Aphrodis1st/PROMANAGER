// /hospital/departments/AssignHeadOfDepartment.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Select } from "../../components/hospital/Form";
import { useDepartments } from "../../hooks/useDepartments";
import { useDoctors } from "../../hooks/useDoctorContext";

export default function AssignHeadOfDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assignHead } = useDepartments();
  const { doctors } = useDoctors();

  const handleSubmit = async (values) => {
    await assignHead(id, values.doctorId);
    navigate(`/hospital/departments/${id}`);
  };

  return (
    <>
      <PageHeader title="Assign Head of Department" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Select
            name="doctorId"
            label="Select Doctor"
            options={doctors.map(d => ({
              label: `${d.fullName} - ${d.specialization}`,
              value: d.id,
            }))}
            required
          />
        </Form>
      </Card>
    </>
  );
}
