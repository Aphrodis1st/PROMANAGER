import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select } from "../../../components/hospital/Form";
import { useDoctors } from "../../../hooks/useDoctors";
import { getDepartmentOptions } from "../../../constants/hospitalDepartments";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor, fetchDoctorById, updateDoctor } = useDoctors();

  useEffect(() => {
    if (id) fetchDoctorById(id);
  }, [id]);

  const handleSubmit = async (values) => {
    await updateDoctor(id, values);
    navigate(`/hospital/doctors/${id}`);
  };

  return (
    <>
      <PageHeader title="Edit Doctor" />
      <Card>
        <Form onSubmit={handleSubmit} defaultValues={doctor}>
          <Input name="fullName" label="Full Name" defaultValue={doctor?.fullName} required />
          <Input name="email" type="email" label="Email" defaultValue={doctor?.email} required />
          <Input name="phone" label="Phone Number" defaultValue={doctor?.phone} required />
          <Select
            name="department"
            label="Department"
            options={getDepartmentOptions()}
            defaultValue={doctor?.department}
            required
          />
          <Input name="specialization" label="Specialization" defaultValue={doctor?.specialization} required />
          <Input name="qualification" label="Qualification" defaultValue={doctor?.qualification} required />
          <Input name="experience" type="number" label="Years of Experience" defaultValue={doctor?.experience} required />
          <Input name="licenseNumber" label="Medical License Number" defaultValue={doctor?.licenseNumber} required />
          <Select
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "On Leave", value: "On Leave" },
              { label: "Inactive", value: "Inactive" },
            ]}
            defaultValue={doctor?.status}
            required
          />
        </Form>
      </Card>
    </>
  );
}
