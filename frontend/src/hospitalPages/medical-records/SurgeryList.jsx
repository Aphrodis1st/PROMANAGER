import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function SurgeryList() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [procedureFilter, setProcedureFilter] = useState('all');

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async () => {
    try {
      setLoading(true);
      console.log('🏥 Fetching all surgery records...');
      
      const surgeryData = await hospitalService.getSurgeryRecords();
      console.log('📋 Surgery records fetched:', surgeryData);
      
      // Enrich surgery data with patient and doctor names
      const enrichedSurgeries = surgeryData.map(surgery => {
        const patient = patients.find(p => p.id === surgery.patientId);
        const surgeon = doctors.find(d => d.id === surgery.surgeon);
        
        return {
          ...surgery,
          patientName: patient?.fullName || surgery.patientName || 'Unknown Patient',
          surgeonName: surgeon?.fullName ? `Dr. ${surgeon.fullName}` : surgery.surgeonName || 'Unknown Surgeon'
        };
      });
      
      setSurgeries(enrichedSurgeries || []);
    } catch (error) {
      console.error('❌ Error fetching surgery records:', error);
      // Sample data for demonstration
      setSurgeries([
        {
          id: 'SRG001',
          patientId: 'patient1',
          patientName: 'John Doe',
          patientAge: 45,
          patientGender: 'Male',
          procedureName: 'Appendectomy',
          procedureCode: '44950',
          surgeon: 'doc1',
          surgeonName: 'Dr. Smith',
          surgeryDate: '2024-01-15',
          startTime: '09:00',
          endTime: '11:30',
          anesthesiaType: 'General',
          status: 'COMPLETED',
          hospitalName: 'E-Hospital System',
          surgicalSuite: 'OR-3',
          complications: 'None',
          createdAt: '2024-01-15T09:00:00Z'
        },
        {
          id: 'SRG002',
          patientId: 'patient2',
          patientName: 'Jane Smith',
          patientAge: 52,
          patientGender: 'Female',
          procedureName: 'Cholecystectomy',
          procedureCode: '47562',
          surgeon: 'doc2',
          surgeonName: 'Dr. Johnson',
          surgeryDate: '2024-01-14',
          startTime: '14:00',
          endTime: '16:00',
          anesthesiaType: 'General',
          status: 'COMPLETED',
          hospitalName: 'E-Hospital System',
          surgicalSuite: 'OR-1',
          complications: 'None',
          createdAt: '2024-01-14T14:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filter surgeries
  const filteredSurgeries = surgeries.filter(surgery => {
    const searchMatch = !searchTerm || 
      surgery.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.surgeonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.procedureName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || surgery.status === statusFilter;
    const procedureMatch = procedureFilter === 'all' || surgery.procedureName === procedureFilter;
    
    return searchMatch && statusMatch && procedureMatch;
  });

  const viewSurgeryDetails = (surgery) => {
    const detailsWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Surgery Record - ${surgery.patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
          .section { margin-bottom: 25px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
          .info-item { padding: 10px; background: #f9fafb; border-radius: 4px; }
          .info-label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
          .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .print-btn { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
          .close-btn { background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">${surgery.hospitalName || 'E-Hospital System'}</div>
          <div>Professional Surgery Record</div>
          <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Surgery Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Surgery ID:</span>
              ${surgery.id}
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span>
              ${formatDate(surgery.surgeryDate)}
            </div>
            <div class="info-item">
              <span class="info-label">Start Time:</span>
              ${formatTime(surgery.startTime)}
            </div>
            <div class="info-item">
              <span class="info-label">End Time:</span>
              ${formatTime(surgery.endTime)}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="status-badge" style="background: ${getStatusColor(surgery.status)}20; color: ${getStatusColor(surgery.status)};">${surgery.status || 'COMPLETED'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Surgical Suite:</span>
              ${surgery.surgicalSuite || 'N/A'}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patient Name:</span>
              ${surgery.patientName}
            </div>
            <div class="info-item">
              <span class="info-label">Patient ID:</span>
              ${surgery.patientId}
            </div>
            <div class="info-item">
              <span class="info-label">Age:</span>
              ${surgery.patientAge || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              ${surgery.patientGender || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Blood Type:</span>
              ${surgery.patientBloodType || 'N/A'}
            </div>
            ${surgery.patientAllergies ? `
              <div class="info-item" style="background: #fef2f2; border: 1px solid #fecaca;">
                <span class="info-label" style="color: #ef4444;">⚠️ Allergies:</span>
                ${surgery.patientAllergies}
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Procedure Details</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Procedure Name:</span>
              ${surgery.procedureName}
            </div>
            <div class="info-item">
              <span class="info-label">CPT Code:</span>
              ${surgery.procedureCode || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Anesthesia Type:</span>
              ${surgery.anesthesiaType}
            </div>
            <div class="info-item">
              <span class="info-label">Blood Loss:</span>
              ${surgery.bloodLoss || 'N/A'}
            </div>
          </div>
          ${surgery.procedureDetails ? `
            <div class="info-item" style="margin-top: 10px;">
              <span class="info-label">Procedure Description:</span>
              ${surgery.procedureDetails}
            </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Surgical Team</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Lead Surgeon:</span>
              ${surgery.surgeonName}
            </div>
            ${surgery.assistantName ? `
              <div class="info-item">
                <span class="info-label">Assistant Surgeon:</span>
                ${surgery.assistantName}
              </div>
            ` : ''}
            ${surgery.anesthesiologistName ? `
              <div class="info-item">
                <span class="info-label">Anesthesiologist:</span>
                ${surgery.anesthesiologistName}
              </div>
            ` : ''}
          </div>
        </div>
        
        ${surgery.preOpDiagnosis || surgery.postOpDiagnosis ? `
          <div class="section">
            <div class="section-title">Diagnosis</div>
            ${surgery.preOpDiagnosis ? `
              <div class="info-item" style="margin-bottom: 10px;">
                <span class="info-label">Pre-Operative Diagnosis:</span>
                ${surgery.preOpDiagnosis}
              </div>
            ` : ''}
            ${surgery.postOpDiagnosis ? `
              <div class="info-item">
                <span class="info-label">Post-Operative Diagnosis:</span>
                ${surgery.postOpDiagnosis}
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${surgery.operativeFindings ? `
          <div class="section">
            <div class="section-title">Operative Findings</div>
            <div class="info-item">
              ${surgery.operativeFindings}
            </div>
          </div>
        ` : ''}
        
        ${surgery.complications ? `
          <div class="section">
            <div class="section-title">Complications</div>
            <div class="info-item">
              ${surgery.complications}
            </div>
          </div>
        ` : ''}
        
        ${surgery.postOpPlan ? `
          <div class="section">
            <div class="section-title">Post-Operative Plan</div>
            <div class="info-item">
              ${surgery.postOpPlan}
            </div>
          </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Hospital Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Hospital:</span>
              ${surgery.hospitalName || 'E-Hospital System'}
            </div>
            <div class="info-item">
              <span class="info-label">License:</span>
              ${surgery.hospitalLicense || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Accreditation:</span>
              ${surgery.accreditation || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Recovery Room:</span>
              ${surgery.recoveryRoom || 'N/A'}
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button class="print-btn" onclick="window.print()">🖨️ Print Record</button>
          <button class="close-btn" onclick="window.close()">✕ Close</button>
        </div>
      </body>
      </html>
    `;
    
    detailsWindow.document.write(htmlContent);
    detailsWindow.document.close();
    detailsWindow.focus();
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Surgery ID,Patient Name,Procedure,Surgeon,Date,Time,Status,Hospital\n" +
      filteredSurgeries.map(s => 
        `"${s.id}","${s.patientName}","${s.procedureName}","${s.surgeonName}","${formatDate(s.surgeryDate)}","${formatTime(s.startTime)}","${s.status}","${s.hospitalName}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `surgery_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <PageHeader title="Surgery Records" />
      
      <Card>
        <div style={headerStyle}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              🏥 All Surgery Records
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              {loading ? 'Loading...' : `${filteredSurgeries.length} surgery record(s) found`}
              {surgeries.length !== filteredSurgeries.length && ` (${surgeries.length} total)`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={fetchSurgeries}
            >
              🔄 Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={exportToCSV}
            >
              📄 Export CSV
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate('/hospital/medical-records/surgery-record')}
            >
              + New Surgery Record
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filter Bar */}
      <Card>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Search Records</label>
              <input
                type="text"
                placeholder="Search by patient, surgeon, or procedure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN-PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Procedure Filter</label>
              <select
                value={procedureFilter}
                onChange={(e) => setProcedureFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Procedures</option>
                <option value="Appendectomy">Appendectomy</option>
                <option value="Cholecystectomy">Cholecystectomy</option>
                <option value="Hernia Repair">Hernia Repair</option>
                <option value="Cesarean Section">Cesarean Section</option>
                <option value="Hip Replacement">Hip Replacement</option>
                <option value="Knee Arthroscopy">Knee Arthroscopy</option>
              </select>
            </div>
            <div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setProcedureFilter('all');
                }}
              >
                🔄 Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading surgery records...</div>
            <div style={{ fontSize: '0.875rem' }}>Please wait while we fetch the data</div>
          </div>
        </Card>
      ) : filteredSurgeries.length === 0 ? (
        <Card>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Surgery Records Found</div>
            <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {searchTerm || statusFilter !== 'all' || procedureFilter !== 'all' 
                ? 'No surgery records match your current filters. Try adjusting your search criteria.' 
                : 'No surgery records have been created in the system yet.'}
            </div>
            <Button onClick={() => navigate('/hospital/medical-records/surgery-record')}>
              Create First Surgery Record
            </Button>
          </div>
        </Card>
      ) : (
        filteredSurgeries.map((surgery, index) => (
          <div key={surgery.id || index} style={cardStyle}>
            <div style={headerStyle}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                    🏥 Surgery #{surgery.id || index + 1}
                  </h4>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    backgroundColor: getStatusColor(surgery.status) + '20',
                    color: getStatusColor(surgery.status),
                    border: `1px solid ${getStatusColor(surgery.status)}40`
                  }}>
                    {surgery.status || 'COMPLETED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {surgery.procedureName} • {formatDate(surgery.surgeryDate)} at {formatTime(surgery.startTime)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => viewSurgeryDetails(surgery)}
                >
                  🔍 View Details
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const patient = patients.find(p => p.id === surgery.patientId);
                    if (patient) {
                      navigate(`/hospital/patients/details/${patient.id}`);
                    } else {
                      alert(`Patient Information:\nName: ${surgery.patientName}\nID: ${surgery.patientId}\nNote: Full patient details not available`);
                    }
                  }}
                >
                  👤 View Patient
                </Button>
              </div>
            </div>
            
            <div style={contentStyle}>
              {/* Patient Info */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #d1fae5' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  👤 Patient Information
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Name:</strong> {surgery.patientName}</div>
                  <div><strong>Age:</strong> {surgery.patientAge || 'N/A'}</div>
                  <div><strong>Gender:</strong> {surgery.patientGender || 'N/A'}</div>
                  <div><strong>Blood Type:</strong> {surgery.patientBloodType || 'N/A'}</div>
                </div>
                {surgery.patientAllergies && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#ef4444' }}>
                    ⚠️ <strong>Allergies:</strong> {surgery.patientAllergies}
                  </div>
                )}
              </div>

              {/* Procedure Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  🔬 Procedure Details
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Procedure:</strong> {surgery.procedureName}</div>
                  <div><strong>CPT Code:</strong> {surgery.procedureCode || 'N/A'}</div>
                  <div><strong>Anesthesia:</strong> {surgery.anesthesiaType}</div>
                  <div><strong>Duration:</strong> {surgery.startTime && surgery.endTime ? `${formatTime(surgery.startTime)} - ${formatTime(surgery.endTime)}` : 'N/A'}</div>
                  <div><strong>Surgical Suite:</strong> {surgery.surgicalSuite || 'N/A'}</div>
                  <div><strong>Blood Loss:</strong> {surgery.bloodLoss || 'N/A'}</div>
                </div>
              </div>

              {/* Surgical Team */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  👨‍⚕️ Surgical Team
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Lead Surgeon:</strong> {surgery.surgeonName}</div>
                  {surgery.assistantName && <div><strong>Assistant:</strong> {surgery.assistantName}</div>}
                  {surgery.anesthesiologistName && <div><strong>Anesthesiologist:</strong> {surgery.anesthesiologistName}</div>}
                </div>
              </div>

              {/* Hospital Info */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  <div>
                    <strong>Hospital:</strong> {surgery.hospitalName || 'E-Hospital System'}
                    {surgery.accreditation && ` • ${surgery.accreditation} Accredited`}
                  </div>
                  <div>
                    <strong>Record Created:</strong> {formatDate(surgery.createdAt || surgery.surgeryDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Debug Info */}
      <Card>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', fontSize: '0.75rem', color: '#6c757d' }}>
          <strong>🔍 Debug Info:</strong> 
          Total Surgery Records: {surgeries.length} | 
          Filtered: {filteredSurgeries.length} | 
          Patients Loaded: {patients.length} | 
          Doctors Loaded: {doctors.length} | 
          API: /api/v1/hospital/surgery-records
        </div>
      </Card>
    </>
  );
}
