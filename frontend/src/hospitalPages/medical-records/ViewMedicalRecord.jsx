import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function ViewMedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { records, fetchRecords } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true);
      console.log('Loading record with ID:', id);
      
      // First try to find in existing records
      let foundRecord = records.find(r => r.id === id);
      
      if (foundRecord) {
        console.log('Found record in existing records:', foundRecord);
        setRecord(foundRecord);
        setLoading(false);
        return;
      }
      
      // If not found, try to fetch records for all patients and find the record
      console.log('Record not found in existing records, searching through all patients...');
      
      for (const patient of patients) {
        try {
          const patientRecords = await fetchRecords(patient.id);
          foundRecord = patientRecords.find(r => r.id === id);
          
          if (foundRecord) {
            console.log('Found record for patient:', patient.fullName, foundRecord);
            setRecord({ ...foundRecord, patientName: patient.fullName, patientId: patient.id });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error(`Error fetching records for patient ${patient.fullName}:`, error);
        }
      }
      
      console.log('Record not found anywhere');
      setLoading(false);
    };
    
    if (id && patients.length > 0) {
      loadRecord();
    }
  }, [id, patients, records, fetchRecords]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading medical record...</p>
        <Button onClick={() => navigate("/hospital/medical-records")}>Back to Records</Button>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Medical record not found.</p>
        <Button onClick={() => navigate("/hospital/medical-records")}>Back to Records</Button>
      </div>
    );
  }

  const patient = patients.find(p => p.id === record.patientId);
  const doctor = doctors.find(d => d.id === record.doctorId);

  return (
    <>
      <PageHeader
        title={`Medical Record – ${patient?.fullName || record.patientName || 'Patient'}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/hospital/medical-records/vitals/${id}`)}>
              Record Vitals
            </Button>
            <Button onClick={() => navigate(`/hospital/lab/create?patientId=${record.patientId}`)}>
              Order Lab Tests
            </Button>
            <Button onClick={() => navigate(`/hospital/medical-records/diagnosis/${id}`)}>
              Add Diagnosis
            </Button>
            <Button onClick={() => navigate(`/hospital/medical-records/prescription/${id}`)}>
              Prescription
            </Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/medical-records")}>
              Back
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-6">

        {/* Patient Overview */}
        <Card>
          <h3 className="font-bold text-lg mb-4">Patient Overview</h3>
          <p><strong>Patient:</strong> {patient?.fullName || 'N/A'}</p>
          <p><strong>Record #:</strong> {record.recordNumber || record.id}</p>
          <p><strong>Primary Doctor:</strong> {doctor?.fullName || record.primaryDoctor || 'N/A'}</p>
          <p><strong>Blood Type:</strong> {patient?.bloodGroup || record.bloodType || 'N/A'}</p>
          <p><strong>Allergies:</strong> {record.allergies || "None"}</p>
          <Badge variant="info">Active Record</Badge>
        </Card>

        {/* Visit History */}
        <Card className="col-span-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="font-bold text-lg">Latest Vital Signs</h3>
            <Button size="sm" onClick={() => navigate(`/hospital/medical-records/vitals-trends/${id}`)}>
              View Trends
            </Button>
          </div>
          {record.latestVitals ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", fontSize: "0.875rem" }}>
              <div><strong>Temp:</strong> {record.latestVitals.temperature}°C</div>
              <div><strong>BP:</strong> {record.latestVitals.systolic}/{record.latestVitals.diastolic}</div>
              <div><strong>HR:</strong> {record.latestVitals.heartRate} bpm</div>
              <div><strong>SpO₂:</strong> {record.latestVitals.spo2}%</div>
            </div>
          ) : (
            <p className="text-gray-500">No vital signs recorded yet</p>
          )}
        </Card>

        {/* Diagnoses */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Diagnoses</h3>
          {record.diagnoses && record.diagnoses.length > 0 ? (
            record.diagnoses.map((d, i) => (
              <div key={i} className="border-b py-2">
                <p><strong>ICD Code:</strong> {d.code}</p>
                <p><strong>Description:</strong> {d.description}</p>
                <Badge variant="warning">{d.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No diagnoses recorded</p>
          )}
        </Card>

        {/* Lab Results */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Laboratory Results</h3>
          {record.labs && record.labs.length > 0 ? (
            record.labs.map((lab, i) => (
              <div key={i} className="border-b py-2">
                <p><strong>Test:</strong> {lab.name}</p>
                <p><strong>Result:</strong> {lab.result}</p>
                <p><strong>Date:</strong> {lab.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No lab results available</p>
          )}
        </Card>

        {/* Imaging */}
        <Card className="col-span-3">
          <h3 className="font-bold text-lg mb-4">Imaging & Radiology</h3>
          {record.imaging && record.imaging.length > 0 ? (
            record.imaging.map((img, i) => (
              <div key={i} className="border-b py-2">
                <p><strong>Type:</strong> {img.type}</p>
                <p><strong>Findings:</strong> {img.findings}</p>
                <p><strong>Date:</strong> {img.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No imaging records available</p>
          )}
        </Card>

      </div>
    </>
  );
}
