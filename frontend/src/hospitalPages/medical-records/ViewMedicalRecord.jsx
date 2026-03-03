// /hospital/medical-records/ViewMedicalRecord.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function ViewMedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecordById } = useMedicalRecords();

  const record = getRecordById(id);
  if (!record) return null;

  return (
    <>
      <PageHeader
        title={`Medical Record – ${record.patientName}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => navigate(`diagnosis/${id}`)}>
              Add Diagnosis
            </Button>
            <Button onClick={() => navigate(`treatment/${id}`)}>
              Treatment Plan
            </Button>
            <Button onClick={() => navigate(`prescription/${id}`)}>
              Add Prescription
            </Button>
            <Button onClick={() => navigate(`surgery/${id}`)}>
              Surgery Record
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-6">

        {/* Patient Overview */}
        <Card>
          <h3 className="font-bold text-lg mb-4">Patient Overview</h3>
          <p><strong>Record #:</strong> {record.recordNumber}</p>
          <p><strong>Primary Doctor:</strong> {record.primaryDoctor}</p>
          <p><strong>Blood Type:</strong> {record.bloodType}</p>
          <p><strong>Allergies:</strong> {record.allergies || "None"}</p>
          <Badge variant="info">Active Record</Badge>
        </Card>

        {/* Visit History */}
        <Card className="col-span-2">
          <h3 className="font-bold text-lg mb-4">Visit History</h3>
          {record.visits?.map((visit, i) => (
            <div key={i} className="border-b py-2">
              <p><strong>Date:</strong> {visit.date}</p>
              <p><strong>Doctor:</strong> {visit.doctor}</p>
              <p><strong>Reason:</strong> {visit.reason}</p>
            </div>
          ))}
        </Card>

        {/* Diagnoses */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Diagnoses</h3>
          {record.diagnoses?.map((d, i) => (
            <div key={i} className="border-b py-2">
              <p><strong>ICD Code:</strong> {d.code}</p>
              <p><strong>Description:</strong> {d.description}</p>
              <Badge variant="warning">{d.status}</Badge>
            </div>
          ))}
        </Card>

        {/* Lab Results */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Laboratory Results</h3>
          {record.labs?.map((lab, i) => (
            <div key={i} className="border-b py-2">
              <p><strong>Test:</strong> {lab.name}</p>
              <p><strong>Result:</strong> {lab.result}</p>
              <p><strong>Date:</strong> {lab.date}</p>
            </div>
          ))}
        </Card>

        {/* Imaging */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Imaging & Radiology</h3>
          {record.imaging?.map((img, i) => (
            <div key={i} className="border-b py-2">
              <p><strong>Type:</strong> {img.type}</p>
              <p><strong>Findings:</strong> {img.findings}</p>
              <p><strong>Date:</strong> {img.date}</p>
            </div>
          ))}
        </Card>

      </div>
    </>
  );
}
