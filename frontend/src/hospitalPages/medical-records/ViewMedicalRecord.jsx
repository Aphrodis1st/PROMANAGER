import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import LoadingSpinner from "../../components/hospital/LoadingSpinner";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import { useLab } from "../../hooks/useLab";
import hospitalService from "../../services/hospitalService";

export default function ViewMedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { records, fetchRecords, deleteRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const { labOrders } = useLab();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vitalSignsHistory, setVitalSignsHistory] = useState([]);
  const [patientLabTests, setPatientLabTests] = useState([]);
  const [error, setError] = useState(null);
  const [vitalSignsLoading, setVitalSignsLoading] = useState(false);

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true);
      console.log('Loading record with ID:', id);
      
      try {
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
        
        // If not found, try to fetch the record directly by ID
        console.log('Record not found in existing records, trying direct fetch...');
        try {
          const directRecord = await hospitalService.getMedicalRecordById(id);
          if (directRecord) {
            console.log('Found record by direct fetch:', directRecord);
            // Find patient info
            const patient = patients.find(p => p.id === directRecord.patientId);
            const enrichedRecord = { 
              ...directRecord, 
              patientName: patient?.fullName || 'Unknown Patient',
              patientId: directRecord.patientId 
            };
            setRecord(enrichedRecord);
            await loadVitalSigns(directRecord.patientId);
            await loadLabTests(directRecord.patientId);
            setLoading(false);
            return;
          }
        } catch (directError) {
          console.error('Direct fetch failed:', directError);
        }
        
        // If still not found, search through all patients (fallback)
        console.log('Direct fetch failed, searching through all patients...');
        
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
      } catch (error) {
        console.error('Error in loadRecord:', error);
        setLoading(false);
      }
    };
    
    if (id && patients.length > 0) {
      loadRecord();
    }
  }, [id, patients.length]); // Removed fetchRecords and records from dependencies

  // Memoize the vital signs loading to prevent unnecessary re-renders
  const loadVitalSigns = React.useCallback(async (patientId) => {
    if (!patientId) return;
    
    setVitalSignsLoading(true);
    try {
      console.log('Loading vital signs for patient:', patientId);
      const vitalSigns = await hospitalService.getVitalSigns(patientId);
      setVitalSignsHistory(vitalSigns || []);
      console.log('Loaded vital signs:', vitalSigns?.length || 0, 'records');
    } catch (error) {
      console.error('Error loading vital signs:', error);
      setVitalSignsHistory([]);
    } finally {
      setVitalSignsLoading(false);
    }
  }, []);

  // Memoize the lab tests loading
  const loadLabTests = React.useCallback(async (patientId) => {
    if (!patientId) return;
    
    try {
      const patientTests = labOrders.filter(order => order.patientId === patientId);
      setPatientLabTests(patientTests);
      console.log('Loaded lab tests for patient:', patientTests.length, 'tests');
    } catch (error) {
      console.error('Error loading lab tests:', error);
      setPatientLabTests([]);
    }
  }, [labOrders]);

  const handleDeleteRecord = async () => {
    if (!record) return;
    
    setDeleting(true);
    try {
      console.log('Deleting medical record:', record.id);
      await deleteRecord(record.id);
      
      // Show success message
      alert('Medical record deleted successfully!');
      
      // Navigate back to medical records list
      navigate('/hospital/medical-records');
    } catch (error) {
      console.error('Error deleting medical record:', error);
      alert('Failed to delete medical record. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <LoadingSpinner message="Loading medical record..." size="lg" />
        <div style={{ marginTop: "1rem" }}>
          <Button variant="secondary" onClick={() => navigate("/hospital/medical-records")}>Back to Records</Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ color: "#dc2626", marginBottom: "1rem" }}>
          <h3>Error Loading Medical Record</h3>
          <p>{error}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="secondary" onClick={() => navigate("/hospital/medical-records")}>Back to Records</Button>
        </div>
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
            <Button 
              variant="danger" 
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Record'}
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
          
          {vitalSignsLoading ? (
            <LoadingSpinner message="Loading vital signs..." size="sm" />
          ) : vitalSignsHistory && vitalSignsHistory.length > 0 ? (
            <div>
              {/* Display latest vital signs */}
              {(() => {
                const latest = vitalSignsHistory[0];
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    <div><strong>Temp:</strong> {latest.temperature?.value ? `${latest.temperature.value}°${latest.temperature.unit || 'C'}` : 'N/A'}</div>
                    <div><strong>BP:</strong> {latest.bloodPressure ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : 'N/A'}</div>
                    <div><strong>HR:</strong> {latest.heartRate ? `${latest.heartRate} bpm` : 'N/A'}</div>
                    <div><strong>SpO₂:</strong> {latest.oxygenSaturation ? `${latest.oxygenSaturation}%` : 'N/A'}</div>
                    <div><strong>Weight:</strong> {latest.weight ? `${latest.weight} kg` : 'N/A'}</div>
                    <div><strong>Height:</strong> {latest.height ? `${latest.height} cm` : 'N/A'}</div>
                    <div><strong>Resp Rate:</strong> {latest.respiratoryRate ? `${latest.respiratoryRate}/min` : 'N/A'}</div>
                    <div><strong>Recorded:</strong> {latest.recordedAt ? new Date(latest.recordedAt.seconds ? latest.recordedAt.seconds * 1000 : latest.recordedAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                );
              })()
              }
              {/* Show recent vital signs history */}
              {vitalSignsHistory.length > 1 && (
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "0.5rem" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>Recent History ({vitalSignsHistory.length - 1} more records)</p>
                  <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                    {vitalSignsHistory.slice(1, 4).map((vital, i) => (
                      <div key={i} style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                        {new Date(vital.recordedAt?.seconds ? vital.recordedAt.seconds * 1000 : vital.recordedAt).toLocaleDateString()} - 
                        Temp: {vital.temperature?.value || 'N/A'}, 
                        BP: {vital.bloodPressure ? `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}` : 'N/A'}, 
                        HR: {vital.heartRate || 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : record.vitalSigns && (record.vitalSigns.temperature || record.vitalSigns.bloodPressure || record.vitalSigns.heartRate) ? (
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
            <div>
              <p className="text-gray-500">No vital signs recorded yet</p>
              <Button size="sm" onClick={() => navigate(`/hospital/medical-records/vitals/${id}`)} style={{ marginTop: "0.5rem" }}>
                Record First Vital Signs
              </Button>
            </div>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 className="font-bold text-lg">Assessment & Diagnosis</h3>
              <Button size="sm" onClick={() => navigate(`/hospital/medical-records/diagnosis/${id}?patientId=${record.patientId}`)}>
                Add Diagnosis
              </Button>
            </div>
            
            {/* Primary Diagnosis */}
            {record.diagnosis && (
              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#fef3c7", borderLeft: "4px solid #f59e0b", borderRadius: "0.375rem" }}>
                <strong>Primary Diagnosis:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.diagnosis}</p>
              </div>
            )}
            
            {/* Differential Diagnosis */}
            {record.differentialDiagnosis && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Differential Diagnosis:</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem" }}>{record.differentialDiagnosis}</p>
              </div>
            )}
            
            {/* Structured Diagnosis Entries */}
            {record.diagnoses && record.diagnoses.length > 0 && (
              <div>
                <strong>Diagnosis Entries:</strong>
                <div style={{ marginTop: "0.5rem" }}>
                  {record.diagnoses.map((d, i) => (
                    <div key={i} style={{ 
                      border: "1px solid #e5e7eb", 
                      borderRadius: "0.375rem", 
                      padding: "1rem", 
                      marginBottom: "0.5rem",
                      backgroundColor: "#f9fafb"
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "0.5rem" }}>
                        <div><strong>ICD Code:</strong> {d.code}</div>
                        <div><strong>Severity:</strong> <Badge variant={d.severity === 'Critical' ? 'danger' : d.severity === 'Severe' ? 'warning' : 'info'}>{d.severity}</Badge></div>
                        <div><strong>Status:</strong> <Badge variant={d.status === 'Active' ? 'success' : 'secondary'}>{d.status}</Badge></div>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Description:</strong> {d.description}
                      </div>
                      {d.symptoms && (
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Symptoms:</strong> {d.symptoms}
                        </div>
                      )}
                      {d.treatmentRecommendations && (
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Treatment:</strong> {d.treatmentRecommendations}
                        </div>
                      )}
                      {d.diagnosisDate && (
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          Diagnosed: {new Date(d.diagnosisDate).toLocaleDateString()}
                          {d.diagnosedBy && ` by Dr. ${doctors.find(doc => doc.id === d.diagnosedBy)?.fullName || d.diagnosedBy}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#dc2626'
            }}>
              ⚠️ Confirm Delete Medical Record
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#374151' }}>
              Are you sure you want to delete this medical record for <strong>{patient?.fullName || record.patientName || 'this patient'}</strong>?
            </p>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.375rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                <strong>Warning:</strong> This action cannot be undone. All associated data including:
              </p>
              <ul style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '0.5rem', paddingLeft: '1rem' }}>
                <li>• Diagnosis entries</li>
                <li>• Treatment plans</li>
                <li>• Clinical notes</li>
                <li>• Visit information</li>
              </ul>
              <p style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '0.5rem' }}>
                will be permanently deleted.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button 
                variant="secondary" 
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteRecord}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Record'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
