import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function TreatmentPlanList() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [careTypeFilter, setCareTypeFilter] = useState('all');

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching all treatment plans...');
      
      const planData = await hospitalService.getTreatmentPlans();
      console.log('📋 Treatment plans fetched:', planData);
      
      // Enrich with patient and doctor names
      const enrichedPlans = planData.map(plan => {
        const patient = patients.find(p => p.id === plan.patientId);
        const doctor = doctors.find(d => d.id === plan.planCreatedBy);
        
        return {
          ...plan,
          patientName: patient?.fullName || plan.patientName || 'Unknown Patient',
          doctorName: doctor?.fullName ? `Dr. ${doctor.fullName}` : plan.doctorName || 'Unknown Doctor'
        };
      });
      
      setTreatmentPlans(enrichedPlans || []);
    } catch (error) {
      console.error('❌ Error fetching treatment plans:', error);
      // Sample data
      setTreatmentPlans([
        {
          id: 'TP001',
          patientId: 'patient1',
          patientName: 'John Doe',
          patientAge: 45,
          diagnosis: 'Type 2 Diabetes Mellitus',
          icd10Code: 'E11.9',
          treatmentGoals: 'Achieve HbA1c < 7%, maintain healthy weight, prevent complications',
          careType: 'Outpatient',
          treatmentPhase: 'Active',
          planCreatedBy: 'doc1',
          doctorName: 'Dr. Smith',
          planDate: '2024-01-15',
          reviewDate: '2024-04-15',
          status: 'ACTIVE',
          createdAt: '2024-01-15T10:00:00Z'
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'on-hold': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredPlans = treatmentPlans.filter(plan => {
    const searchMatch = !searchTerm || 
      plan.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || plan.status === statusFilter;
    const careTypeMatch = careTypeFilter === 'all' || plan.careType === careTypeFilter;
    
    return searchMatch && statusMatch && careTypeMatch;
  });

  const viewPlanDetails = (plan) => {
    const detailsWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Treatment Plan - ${plan.patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 28px; font-weight: bold; color: #10b981; margin-bottom: 5px; }
          .section { margin-bottom: 25px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
          .info-item { padding: 10px; background: #f9fafb; border-radius: 4px; }
          .info-label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
          .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .print-btn { background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
          .close-btn { background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">E-Hospital System</div>
          <div>Professional Treatment Plan</div>
          <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Plan Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Plan ID:</span>
              ${plan.id}
            </div>
            <div class="info-item">
              <span class="info-label">Plan Date:</span>
              ${formatDate(plan.planDate)}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="status-badge" style="background: ${getStatusColor(plan.status)}20; color: ${getStatusColor(plan.status)};">${plan.status || 'ACTIVE'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Care Type:</span>
              ${plan.careType}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patient Name:</span>
              ${plan.patientName}
            </div>
            <div class="info-item">
              <span class="info-label">Patient ID:</span>
              ${plan.patientId}
            </div>
            <div class="info-item">
              <span class="info-label">Age:</span>
              ${plan.patientAge || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              ${plan.patientGender || 'N/A'}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Diagnosis & Treatment</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Diagnosis:</span>
              ${plan.diagnosis}
            </div>
            <div class="info-item">
              <span class="info-label">ICD-10 Code:</span>
              ${plan.icd10Code || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Treatment Phase:</span>
              ${plan.treatmentPhase || 'N/A'}
            </div>
            <div class="info-item">
              <span class="info-label">Duration:</span>
              ${plan.estimatedDuration || 'N/A'}
            </div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <span class="info-label">Treatment Goals:</span>
            ${plan.treatmentGoals}
          </div>
        </div>
        
        ${plan.therapyPlan ? `
          <div class="section">
            <div class="section-title">Therapy Plan</div>
            <div class="info-item">
              ${plan.therapyPlan}
            </div>
          </div>
        ` : ''}
        
        ${plan.medications ? `
          <div class="section">
            <div class="section-title">Medications</div>
            <div class="info-item">
              ${plan.medications}
            </div>
          </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Care Team</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Primary Physician:</span>
              ${plan.doctorName}
            </div>
            <div class="info-item">
              <span class="info-label">Review Date:</span>
              ${plan.reviewDate ? formatDate(plan.reviewDate) : 'Not scheduled'}
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button class="print-btn" onclick="window.print()">🖨️ Print Plan</button>
          <button class="close-btn" onclick="window.close()">✕ Close</button>
        </div>
      </body>
      </html>
    `;
    
    detailsWindow.document.write(htmlContent);
    detailsWindow.document.close();
    detailsWindow.focus();
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
      <PageHeader title="Treatment Plans" />
      
      <Card>
        <div style={headerStyle}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              📋 All Treatment Plans
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              {loading ? 'Loading...' : `${filteredPlans.length} treatment plan(s) found`}
              {treatmentPlans.length !== filteredPlans.length && ` (${treatmentPlans.length} total)`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={fetchTreatmentPlans}
            >
              🔄 Refresh
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate('/hospital/medical-records/treatment-plan')}
            >
              + New Treatment Plan
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <Card>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Search Plans</label>
              <input
                type="text"
                placeholder="Search by patient, doctor, or diagnosis..."
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
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON-HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Care Type Filter</label>
              <select
                value={careTypeFilter}
                onChange={(e) => setCareTypeFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Care Types</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Rehabilitation">Rehabilitation</option>
                <option value="Home Care">Home Care</option>
                <option value="Palliative">Palliative Care</option>
              </select>
            </div>
            <div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCareTypeFilter('all');
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
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading treatment plans...</div>
            <div style={{ fontSize: '0.875rem' }}>Please wait while we fetch the data</div>
          </div>
        </Card>
      ) : filteredPlans.length === 0 ? (
        <Card>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Treatment Plans Found</div>
            <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {searchTerm || statusFilter !== 'all' || careTypeFilter !== 'all' 
                ? 'No treatment plans match your current filters.' 
                : 'No treatment plans have been created yet.'}
            </div>
            <Button onClick={() => navigate('/hospital/medical-records/treatment-plan')}>
              Create First Treatment Plan
            </Button>
          </div>
        </Card>
      ) : (
        filteredPlans.map((plan, index) => (
          <div key={plan.id || index} style={cardStyle}>
            <div style={headerStyle}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                    📋 Plan #{plan.id || index + 1}
                  </h4>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    backgroundColor: getStatusColor(plan.status) + '20',
                    color: getStatusColor(plan.status),
                    border: `1px solid ${getStatusColor(plan.status)}40`
                  }}>
                    {plan.status || 'ACTIVE'}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {plan.diagnosis} • Created {formatDate(plan.planDate)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => viewPlanDetails(plan)}
                >
                  🔍 View Details
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const patient = patients.find(p => p.id === plan.patientId);
                    if (patient) {
                      navigate(`/hospital/patients/${patient.id}`);
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
                  <div><strong>Name:</strong> {plan.patientName}</div>
                  <div><strong>Age:</strong> {plan.patientAge || 'N/A'}</div>
                  <div><strong>Gender:</strong> {plan.patientGender || 'N/A'}</div>
                  <div><strong>Care Type:</strong> {plan.careType}</div>
                </div>
              </div>

              {/* Treatment Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  🎯 Treatment Goals
                </h5>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {plan.treatmentGoals}
                </p>
              </div>

              {/* Care Team */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  <div>
                    <strong>Primary Physician:</strong> {plan.doctorName}
                  </div>
                  <div>
                    <strong>Next Review:</strong> {plan.reviewDate ? formatDate(plan.reviewDate) : 'Not scheduled'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
