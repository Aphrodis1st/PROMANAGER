import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import { useLab } from "../../hooks/useLab";
import axios from "axios";

export default function ViewMedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { records, fetchRecords } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { labOrders } = useLab();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vitalSignsHistory, setVitalSignsHistory] = useState([]);
  const [patientLabTests, setPatientLabTests] = useState([]);

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true);
      console.log('Loading record with ID:', id);
      
        // First try to find in existing records
        let foundRecord = records.find(r => r.id === id);
        
        if (foundRecord) {
          console.log('Found record in existing records:', foundRecord);
          setRecord(foundRecord);
          await loadVitalSigns(foundRecord.patientId);
          await loadLabTests(foundRecord.patientId);
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
              const enrichedRecord = { ...foundRecord, patientName: patient.fullName, patientId: patient.id };
              setRecord(enrichedRecord);
              await loadVitalSigns(patient.id);
              await loadLabTests(patient.id);
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

  const loadVitalSigns = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/v1/hospital/vital-signs/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVitalSignsHistory(response.data || []);
      console.log('Loaded vital signs:', response.data);
    } catch (error) {
      console.error('Error loading vital signs:', error);
      setVitalSignsHistory([]);
    }
  };

  const loadLabTests = async (patientId) => {
    try {
      const patientTests = labOrders.filter(order => order.patientId === patientId);
      setPatientLabTests(patientTests);
      console.log('Loaded lab tests for patient:', patientTests);
    } catch (error) {
      console.error('Error loading lab tests:', error);
      setPatientLabTests([]);
    }
  };

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
          <p><strong>Visit Date:</strong> {record.visitDate || 'N/A'}</p>
          <p><strong>Visit Type:</strong> {record.visitType || 'N/A'}</p>
          <p><strong>Primary Doctor:</strong> {doctor?.fullName || record.primaryDoctor || 'N/A'}</p>
          <p><strong>Blood Type:</strong> {patient?.bloodGroup || record.bloodType || 'N/A'}</p>
          <Badge variant="info">Active Record</Badge>
        </Card>

        {/* Latest Vital Signs */}
        <Card className="col-span-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="font-bold text-lg">Latest Vital Signs</h3>
            <Button size="sm" onClick={() => navigate(`/hospital/medical-records/vitals-trends/${id}`)}>
              View Trends
            </Button>
          </div>
          {record.vitalSigns && (record.vitalSigns.temperature || record.vitalSigns.bloodPressure || record.vitalSigns.heartRate) ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", fontSize: "0.875rem" }}>
              <div><strong>Temp:</strong> {record.vitalSigns.temperature || 'N/A'}</div>
              <div><strong>BP:</strong> {record.vitalSigns.bloodPressure || 'N/A'}</div>
              <div><strong>HR:</strong> {record.vitalSigns.heartRate || 'N/A'} bpm</div>
              <div><strong>SpO₂:</strong> {record.vitalSigns.oxygenSaturation || 'N/A'}%</div>
              <div><strong>Weight:</strong> {record.vitalSigns.weight || 'N/A'}</div>
              <div><strong>Height:</strong> {record.vitalSigns.height || 'N/A'}</div>
              <div><strong>BMI:</strong> {record.vitalSigns.bmi || 'N/A'}</div>
              <div><strong>Resp Rate:</strong> {record.vitalSigns.respiratoryRate || 'N/A'}</div>
            </div>
          ) : record.latestVitals ? (
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

        {/* Chief Complaint */}
        {record.chiefComplaint && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Chief Complaint</h3>
            <p>{record.chiefComplaint}</p>
            {(record.duration || record.severity) && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                {record.duration && <span><strong>Duration:</strong> {record.duration} </span>}
                {record.severity && <span><strong>Severity:</strong> <Badge variant="warning">{record.severity}</Badge></span>}
              </div>
            )}
          </Card>
        )}

        {/* History of Present Illness */}
        {record.presentIllness && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">History of Present Illness</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{record.presentIllness}</p>
          </Card>
        )}

        {/* Medical History */}
        {(record.medicalHistory || record.surgicalHistory || record.familyHistory || record.socialHistory) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Medical History</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {record.medicalHistory && (
                <div>
                  <strong>Past Medical History:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.medicalHistory}</p>
                </div>
              )}
              {record.surgicalHistory && (
                <div>
                  <strong>Surgical History:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.surgicalHistory}</p>
                </div>
              )}
              {record.familyHistory && (
                <div>
                  <strong>Family History:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.familyHistory}</p>
                </div>
              )}
              {record.socialHistory && (
                <div>
                  <strong>Social History:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.socialHistory}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Allergies & Medications */}
        {(record.allergies || record.currentMedications) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Allergies & Current Medications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div>
                <strong>Known Allergies:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.allergies || "None"}</p>
              </div>
              {record.currentMedications && (
                <div>
                  <strong>Current Medications:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.currentMedications}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Physical Examination */}
        {(record.physicalExamination || record.reviewOfSystems) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Physical Examination & Review of Systems</h3>
            {record.physicalExamination && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Physical Examination:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.physicalExamination}</p>
              </div>
            )}
            {record.reviewOfSystems && (
              <div>
                <strong>Review of Systems:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.reviewOfSystems}</p>
              </div>
            )}
          </Card>
        )}

        {/* Diagnosis */}
        {(record.diagnosis || record.differentialDiagnosis || (record.diagnoses && record.diagnoses.length > 0)) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Assessment & Diagnosis</h3>
            {record.diagnosis && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Primary Diagnosis:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.diagnosis}</p>
              </div>
            )}
            {record.differentialDiagnosis && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Differential Diagnosis:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.differentialDiagnosis}</p>
              </div>
            )}
            {record.diagnoses && record.diagnoses.length > 0 && (
              <div>
                <strong>Diagnosis Entries:</strong>
                {record.diagnoses.map((d, i) => (
                  <div key={i} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <p><strong>ICD Code:</strong> {d.code}</p>
                    <p><strong>Description:</strong> {d.description}</p>
                    <Badge variant="warning">{d.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Diagnostic Tests */}
        {(record.labTests || record.imagingStudies) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Diagnostic Tests Ordered</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {record.labTests && (
                <div>
                  <strong>Laboratory Tests:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.labTests}</p>
                </div>
              )}
              {record.imagingStudies && (
                <div>
                  <strong>Imaging Studies:</strong>
                  <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.imagingStudies}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Lab Results */}
        {record.labs && record.labs.length > 0 && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Laboratory Results</h3>
            {record.labs.map((lab, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                <p><strong>Test:</strong> {lab.name}</p>
                <p><strong>Result:</strong> {lab.result}</p>
                <p><strong>Date:</strong> {lab.date}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Imaging */}
        {record.imaging && record.imaging.length > 0 && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Imaging & Radiology</h3>
            {record.imaging.map((img, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                <p><strong>Type:</strong> {img.type}</p>
                <p><strong>Findings:</strong> {img.findings}</p>
                <p><strong>Date:</strong> {img.date}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Treatment Plan */}
        {(record.treatmentPlan || record.prescriptions || record.followUpInstructions) && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Treatment Plan</h3>
            {record.treatmentPlan && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Treatment Plan:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.treatmentPlan}</p>
              </div>
            )}
            {record.prescriptions && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Prescriptions:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.prescriptions}</p>
              </div>
            )}
            {record.followUpInstructions && (
              <div>
                <strong>Follow-up Instructions:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.followUpInstructions}</p>
              </div>
            )}
          </Card>
        )}

        {/* Additional Notes */}
        {record.notes && (
          <Card className="col-span-3">
            <h3 className="font-bold text-lg mb-4">Additional Notes</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{record.notes}</p>
          </Card>
        )}

      </div>
    </>
  );
}
