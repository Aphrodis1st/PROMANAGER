import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function PrescriptionList() {
  const { id } = useParams(); // medical record ID (optional)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState(null);
  const [viewMode, setViewMode] = useState('patient'); // 'patient' or 'all'

  useEffect(() => {
    // Determine view mode based on route
    if (id === undefined || id === 'all') {
      setViewMode('all');
      fetchAllPrescriptions();
    } else {
      setViewMode('patient');
      const patientId = searchParams.get("patientId");
      if (patientId) {
        const patient = patients.find(p => p.id === patientId);
        setPatientInfo(patient);
        fetchPrescriptions(patientId);
      } else if (id) {
        fetchPrescriptions();
      }
    }
  }, [searchParams, patients, id]);

  const fetchPrescriptions = async (patientId = null) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching prescriptions for patient:', patientId || id);
      
      let prescriptionData = [];
      if (patientId) {
        prescriptionData = await hospitalService.getPrescriptionsByPatient(patientId);
      } else {
        prescriptionData = await hospitalService.getPrescriptions();
      }
      
      console.log('📋 Prescriptions fetched:', prescriptionData);
      setPrescriptions(prescriptionData || []);
    } catch (error) {
      console.error('❌ Error fetching prescriptions:', error);
      // Show sample data for demonstration
      setPrescriptions([
        {
          id: 'px001',
          medicalRecordId: id,
          patientId: patientInfo?.id || 'patient1',
          prescribedBy: 'doc1',
          prescriptionDate: '2024-01-15',
          diagnosis: 'Upper Respiratory Infection',
          medications: [
            {
              medicationName: 'Amoxicillin',
              genericName: 'Amoxicillin',
              strength: '500mg',
              dosage: '1 tablet',
              frequency: 'TID',
              duration: '7 days',
              quantity: '21',
              instructions: 'Take with food'
            },
            {
              medicationName: 'Paracetamol',
              genericName: 'Acetaminophen',
              strength: '500mg',
              dosage: '1-2 tablets',
              frequency: 'QID',
              duration: '5 days',
              quantity: '40',
              instructions: 'Take as needed for fever'
            }
          ],
          status: 'Active',
          urgency: 'Routine',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPrescriptions = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching all prescriptions from all patients...');
      
      const prescriptionData = await hospitalService.getPrescriptions();
      console.log('📋 All prescriptions fetched:', prescriptionData);
      
      // Enrich prescription data with patient and doctor names
      const enrichedPrescriptions = prescriptionData.map(prescription => {
        const patient = patients.find(p => p.id === prescription.patientId);
        const doctor = doctors.find(d => d.id === prescription.prescribedBy);
        
        return {
          ...prescription,
          patientName: patient?.fullName || prescription.patientName || 'Unknown Patient',
          doctorName: doctor?.fullName ? `Dr. ${doctor.fullName}` : prescription.doctorName || 'Unknown Doctor'
        };
      });
      
      setPrescriptions(enrichedPrescriptions || []);
    } catch (error) {
      console.error('❌ Error fetching all prescriptions:', error);
      // Show sample data for demonstration
      setPrescriptions([
        {
          id: 'px001',
          patientId: 'patient1',
          patientName: 'Bony',
          prescribedBy: 'doc1',
          doctorName: 'Dr. Smith',
          prescriptionDate: '2024-01-15',
          diagnosis: 'Upper Respiratory Infection',
          medications: [
            {
              medicationName: 'Amoxicillin',
              genericName: 'Amoxicillin',
              strength: '500mg',
              dosage: '1 tablet',
              frequency: 'TID',
              duration: '7 days',
              quantity: '21',
              instructions: 'Take with food'
            }
          ],
          status: 'Active',
          urgency: 'Routine',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'px002',
          patientId: 'patient2',
          patientName: 'John Doe',
          prescribedBy: 'doc2',
          doctorName: 'Dr. Johnson',
          prescriptionDate: '2024-01-14',
          diagnosis: 'Hypertension',
          medications: [
            {
              medicationName: 'Lisinopril',
              genericName: 'Lisinopril',
              strength: '10mg',
              dosage: '1 tablet',
              frequency: 'QD',
              duration: '30 days',
              quantity: '30',
              instructions: 'Take once daily'
            }
          ],
          status: 'Active',
          urgency: 'Routine',
          createdAt: '2024-01-14T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency': return '#ef4444';
      case 'urgent': return '#f59e0b';
      case 'routine': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.fullName || doctor.name}` : 'Unknown Doctor';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePrescriptionPDF = (prescription) => {
    const printWindow = window.open('', '_blank');
    const patientName = prescription.patientName || patientInfo?.fullName || 'Unknown Patient';
    const doctorName = prescription.doctorName || getDoctorName(prescription.prescribedBy);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
          .hospital-info { font-size: 14px; color: #666; }
          .prescription-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .patient-info, .prescription-info { flex: 1; }
          .patient-info h3, .prescription-info h3 { color: #2563eb; margin-bottom: 10px; }
          .diagnosis { background: #f8fafc; padding: 15px; border-left: 4px solid #10b981; margin-bottom: 30px; }
          .medications { margin-bottom: 30px; }
          .medication { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
          .medication-name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
          .medication-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
          .detail-item { font-size: 14px; }
          .detail-label { font-weight: bold; color: #374151; }
          .instructions { background: #fef3c7; padding: 10px; border-radius: 4px; font-style: italic; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #666; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; }
          .signature-line { border-bottom: 1px solid #333; width: 200px; margin-bottom: 5px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">E-Hospital System</div>
          <div class="hospital-info">Digital Healthcare Management | Tel: (555) 123-4567</div>
        </div>
        
        <div class="prescription-header">
          <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Patient ID:</strong> ${prescription.patientId}</p>
            <p><strong>Date of Birth:</strong> ${patientInfo?.dateOfBirth || 'N/A'}</p>
            <p><strong>Allergies:</strong> ${patientInfo?.allergies || 'None known'}</p>
          </div>
          <div class="prescription-info">
            <h3>Prescription Details</h3>
            <p><strong>Prescription #:</strong> ${prescription.id}</p>
            <p><strong>Date:</strong> ${formatDate(prescription.prescriptionDate || prescription.createdAt)}</p>
            <p><strong>Prescribed by:</strong> ${doctorName}</p>
            <p><strong>Urgency:</strong> ${prescription.urgency || 'Routine'}</p>
          </div>
        </div>
        
        <div class="diagnosis">
          <h3 style="margin-top: 0;">Diagnosis</h3>
          <p>${prescription.diagnosis || 'No diagnosis provided'}</p>
        </div>
        
        <div class="medications">
          <h3>Prescribed Medications</h3>
          ${prescription.medications?.map((med, index) => `
            <div class="medication">
              <div class="medication-name">${index + 1}. ${med.medicationName}</div>
              ${med.genericName ? `<p><strong>Generic:</strong> ${med.genericName}</p>` : ''}
              <div class="medication-details">
                <div class="detail-item"><span class="detail-label">Strength:</span> ${med.strength}</div>
                <div class="detail-item"><span class="detail-label">Dosage:</span> ${med.dosage}</div>
                <div class="detail-item"><span class="detail-label">Frequency:</span> ${med.frequency}</div>
                <div class="detail-item"><span class="detail-label">Duration:</span> ${med.duration}</div>
                <div class="detail-item"><span class="detail-label">Route:</span> ${med.route || 'Oral'}</div>
                <div class="detail-item"><span class="detail-label">Quantity:</span> ${med.quantity}</div>
              </div>
              ${med.instructions ? `<div class="instructions"><strong>Instructions:</strong> ${med.instructions}</div>` : ''}
            </div>
          `).join('') || '<p>No medications prescribed</p>'}
        </div>
        
        ${prescription.pharmacyNotes ? `
          <div class="diagnosis">
            <h3 style="margin-top: 0;">Pharmacy Notes</h3>
            <p>${prescription.pharmacyNotes}</p>
          </div>
        ` : ''}
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Doctor's Signature</p>
            <p>${doctorName}</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Date</p>
            <p>${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This prescription was generated electronically by E-Hospital System</p>
          <p>For questions, please contact the prescribing physician or pharmacy</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-print after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const sharePrescription = async (prescription) => {
    const patientName = prescription.patientName || patientInfo?.fullName || 'Unknown Patient';
    const shareData = {
      title: `Prescription for ${patientName}`,
      text: `Prescription #${prescription.id} for ${patientName}\nDiagnosis: ${prescription.diagnosis}\nMedications: ${prescription.medications?.length || 0} prescribed`,
      url: window.location.href
    };
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('✅ Prescription shared successfully');
      } else {
        // Fallback: Copy to clipboard
        const shareText = `Prescription for ${patientName}\n` +
          `Prescription #: ${prescription.id}\n` +
          `Date: ${formatDate(prescription.prescriptionDate || prescription.createdAt)}\n` +
          `Diagnosis: ${prescription.diagnosis}\n` +
          `Medications: ${prescription.medications?.length || 0} prescribed\n` +
          `Link: ${window.location.href}`;
        
        await navigator.clipboard.writeText(shareText);
        alert('📋 Prescription details copied to clipboard!');
      }
    } catch (error) {
      console.error('❌ Error sharing prescription:', error);
      alert('❌ Unable to share prescription. Please try again.');
    }
  };

  const printAllPrescriptions = () => {
    const printWindow = window.open('', '_blank');
    const patientName = patientInfo?.fullName || 'All Patients';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription Summary - ${patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
          .prescription-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px; page-break-inside: avoid; }
          .prescription-header { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
          .medication { background: #f9fafb; padding: 10px; margin: 10px 0; border-radius: 4px; }
          @media print { body { margin: 0; } .prescription-card { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">E-Hospital System</div>
          <div>Prescription Summary Report</div>
          <div>Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        ${prescriptions.map((prescription, index) => `
          <div class="prescription-card">
            <div class="prescription-header">
              <div>
                <h3>Prescription #${prescription.id || index + 1}</h3>
                <p><strong>Patient:</strong> ${prescription.patientName || 'Unknown'}</p>
                <p><strong>Date:</strong> ${formatDate(prescription.prescriptionDate || prescription.createdAt)}</p>
              </div>
              <div>
                <p><strong>Doctor:</strong> ${prescription.doctorName || getDoctorName(prescription.prescribedBy)}</p>
                <p><strong>Status:</strong> ${prescription.status || 'Active'}</p>
              </div>
            </div>
            <p><strong>Diagnosis:</strong> ${prescription.diagnosis || 'No diagnosis'}</p>
            <div>
              <strong>Medications (${prescription.medications?.length || 0}):</strong>
              ${prescription.medications?.map(med => `
                <div class="medication">
                  <strong>${med.medicationName}</strong> - ${med.strength}<br>
                  Dosage: ${med.dosage}, Frequency: ${med.frequency}, Duration: ${med.duration}
                </div>
              `).join('') || '<p>No medications</p>'}
            </div>
          </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
          <p>Total Prescriptions: ${prescriptions.length}</p>
          <p>Generated by E-Hospital System</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const cardStyle = {
    marginBottom: '1.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle = {
    padding: '1.25rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const contentStyle = {
    padding: '1.5rem'
  };

  return (
    <>
      <PageHeader title={viewMode === 'all' ? "All Prescriptions" : "Prescription History"} />
      
      {patientInfo && viewMode === 'patient' && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderLeft: "4px solid #10b981" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
              Patient: {patientInfo.fullName}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              MRN: {patientInfo.id} | Age: {patientInfo.age} | Allergies: {patientInfo.allergies || "None"}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div style={headerStyle}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              {viewMode === 'all' ? 'All Prescription Records' : 'Prescription Records'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              {loading ? 'Loading...' : `${prescriptions.length} prescription(s) found`}
              {viewMode === 'all' && ' across all patients'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => viewMode === 'all' ? fetchAllPrescriptions() : fetchPrescriptions(patientInfo?.id)}
            >
              🔄 Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={printAllPrescriptions}
            >
              🖨️ Print All
            </Button>
            {viewMode === 'patient' && (
              <Button 
                size="sm" 
                onClick={() => navigate(`/hospital/medical-records/prescription-entry/${id}${patientInfo ? `?patientId=${patientInfo.id}` : ''}`)}
              >
                + New Prescription
              </Button>
            )}
            {viewMode === 'all' && (
              <Button 
                size="sm" 
                onClick={() => navigate('/hospital/medical-records')}
              >
                📋 Medical Records
              </Button>
            )}
          </div>
        </div>
      </Card>

      {prescriptions.length > 0 && (
        <Card>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                🛠️ Quick Actions for {prescriptions.length} prescription(s)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    prescriptions.forEach(prescription => {
                      setTimeout(() => generatePrescriptionPDF(prescription), 100);
                    });
                  }}
                >
                  🖨️ Print All Individual
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const shareText = `Prescription Summary\n` +
                      `Patient: ${patientInfo?.fullName || 'Multiple Patients'}\n` +
                      `Total Prescriptions: ${prescriptions.length}\n` +
                      `Generated: ${new Date().toLocaleString()}\n` +
                      `Link: ${window.location.href}`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'Prescription Summary',
                        text: shareText,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      alert('📋 Summary copied to clipboard!');
                    }
                  }}
                >
                  📤 Share Summary
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      "Prescription ID,Patient Name,Doctor,Date,Diagnosis,Medications Count,Status\n" +
                      prescriptions.map(p => 
                        `"${p.id}","${p.patientName || 'Unknown'}","${p.doctorName || 'Unknown'}","${formatDate(p.prescriptionDate || p.createdAt)}","${p.diagnosis || 'N/A'}","${p.medications?.length || 0}","${p.status || 'Active'}"`
                      ).join("\n");
                    
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `prescriptions_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  📄 Export CSV
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <Card>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading prescriptions...</div>
            <div style={{ fontSize: '0.875rem' }}>Please wait while we fetch the data</div>
          </div>
        </Card>
      ) : prescriptions.length === 0 ? (
        <Card>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Prescriptions Found</div>
            <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {viewMode === 'all' 
                ? 'No prescriptions have been created in the system yet.' 
                : 'No prescriptions have been created for this patient yet.'}
            </div>
            {viewMode === 'patient' && (
              <Button onClick={() => navigate(`/hospital/medical-records/prescription-entry/${id}${patientInfo ? `?patientId=${patientInfo.id}` : ''}`)}>  
                Create First Prescription
              </Button>
            )}
            {viewMode === 'all' && (
              <Button onClick={() => navigate('/hospital/medical-records')}>
                Go to Medical Records
              </Button>
            )}
          </div>
        </Card>
      ) : (
        prescriptions.map((prescription, index) => (
          <div key={prescription.id || index} style={cardStyle}>
            <div style={headerStyle}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                    Prescription #{prescription.id || index + 1}
                  </h4>
                  {viewMode === 'all' && (
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500',
                      backgroundColor: '#e0f2fe',
                      color: '#0277bd',
                      border: '1px solid #b3e5fc'
                    }}>
                      👤 {prescription.patientName || 'Unknown Patient'}
                    </span>
                  )}
                  <span 
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500',
                      backgroundColor: getStatusColor(prescription.status) + '20',
                      color: getStatusColor(prescription.status),
                      border: `1px solid ${getStatusColor(prescription.status)}40`
                    }}
                  >
                    {prescription.status || 'Active'}
                  </span>
                  <span 
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500',
                      backgroundColor: getUrgencyColor(prescription.urgency) + '20',
                      color: getUrgencyColor(prescription.urgency),
                      border: `1px solid ${getUrgencyColor(prescription.urgency)}40`
                    }}
                  >
                    {prescription.urgency || 'Routine'}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Prescribed by {prescription.doctorName || getDoctorName(prescription.prescribedBy)} • {formatDate(prescription.prescriptionDate || prescription.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {viewMode === 'all' && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      const patient = patients.find(p => p.id === prescription.patientId);
                      if (patient) {
                        navigate(`/hospital/patients/${patient.id}`);
                      }
                    }}
                  >
                    👤 View Patient
                  </Button>
                )}
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => generatePrescriptionPDF(prescription)}
                >
                  🖨️ Print PDF
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => sharePrescription(prescription)}
                >
                  📤 Share
                </Button>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
            
            <div style={contentStyle}>
              {/* Diagnosis */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Diagnosis
                </h5>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {prescription.diagnosis || 'No diagnosis provided'}
                </p>
              </div>

              {/* Medications */}
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                  Medications ({prescription.medications?.length || 0})
                </h5>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {prescription.medications?.map((med, medIndex) => (
                    <div 
                      key={medIndex} 
                      style={{ 
                        padding: '1rem', 
                        backgroundColor: '#f9fafb', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                            {med.medicationName}
                          </div>
                          {med.genericName && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Generic: {med.genericName}
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Strength & Dosage</div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {med.strength} - {med.dosage}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Frequency & Duration</div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {med.frequency} for {med.duration}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Quantity</div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {med.quantity} {med.route && `(${med.route})`}
                          </div>
                        </div>
                      </div>
                      {med.instructions && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Instructions</div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {med.instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {prescription.pharmacyNotes && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Pharmacy Notes
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    {prescription.pharmacyNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Debug Info */}
      <Card>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', fontSize: '0.75rem', color: '#6c757d' }}>
          <strong>🔍 Debug Info:</strong> 
          View Mode: {viewMode} | 
          {viewMode === 'patient' ? `Medical Record ID: ${id} | Patient ID: ${patientInfo?.id || 'N/A'}` : 'Showing all patients'} | 
          Prescriptions: {prescriptions.length} | 
          API: /api/v1/hospital/prescriptions{viewMode === 'patient' && patientInfo?.id ? `/patient/${patientInfo.id}` : ''}
        </div>
      </Card>

      {/* Floating Action Button for Mobile */}
      {prescriptions.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <Button
            onClick={printAllPrescriptions}
            style={{
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            title="Print All Prescriptions"
          >
            🖨️
          </Button>
          <Button
            onClick={() => {
              const shareText = `Prescription Summary for ${patientInfo?.fullName || 'Multiple Patients'}\nTotal: ${prescriptions.length} prescriptions\nLink: ${window.location.href}`;
              if (navigator.share) {
                navigator.share({ title: 'Prescriptions', text: shareText, url: window.location.href });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('📋 Link copied!');
              }
            }}
            style={{
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            title="Share Prescriptions"
          >
            📤
          </Button>
        </div>
      )}
    </>
  );
}