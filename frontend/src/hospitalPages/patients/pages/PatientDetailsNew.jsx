import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { usePatients } from "../../../hooks/usePatients";
import { useAppointments } from "../../../hooks/useAppointments";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export default function PatientDetailsComprehensive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { records, fetchRecords } = useMedicalRecords();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const found = patients?.find(p => p.id === id);
    setPatient(found);
    if (found) {
      fetchRecords(id);
    }
  }, [id, patients]);

  const patientAppointments = appointments?.filter(a => a.patientId === id) || [];
  const patientRecords = records || [];

  if (!patient) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading patient details...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Patient: ${patient.fullName}`}
        subtitle={`Patient ID: ${patient.patientId || patient.id}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/hospital/patients/${id}/edit`)}>Edit Patient</Button>
            <Button onClick={() => navigate('/hospital/patients')}>Back to List</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900">{patient.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{patient.gender}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{patient.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{patient.age || 'N/A'} years</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Marital Status</label>
                <p className="text-gray-900">{patient.maritalStatus || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nationality</label>
                <p className="text-gray-900">{patient.nationality || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Contact Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Primary Phone</label>
                <p className="text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Alternate Phone</label>
                <p className="text-gray-900">{patient.alternatePhone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{patient.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-gray-900">
                {patient.address ? (
                  typeof patient.address === 'object' ? 
                    `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}` :
                    patient.address
                ) : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Medical Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Blood Group</label>
              <p className="text-gray-900">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  {patient.bloodGroup || 'N/A'}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Known Allergies</label>
              <p className="text-gray-900">{patient.allergies || 'None reported'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Medical History</label>
              <p className="text-gray-900">{patient.medicalHistory || 'No history recorded'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Current Medications</label>
              <p className="text-gray-900">{patient.currentMedications || 'None reported'}</p>
            </div>
          </div>
        </Card>

        {/* Insurance Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Insurance Information</h3>
          {patient.insurance ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider</label>
                  <p className="text-gray-900 font-medium">{patient.insurance.providerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Policy Number</label>
                  <p className="text-gray-900 font-mono">{patient.insurance.policyNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Group Number</label>
                  <p className="text-gray-900">{patient.insurance.groupNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Subscriber</label>
                  <p className="text-gray-900">{patient.insurance.subscriberName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Copay Amount</label>
                  <p className="text-gray-900">${patient.insurance.copayAmount || '0.00'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Deductible</label>
                  <p className="text-gray-900">${patient.insurance.deductibleAmount || '0.00'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-600">No insurance information on file</p>
          )}
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Emergency Contact</h3>
          {patient.emergencyContact ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Relationship</label>
                  <p className="text-gray-900">{patient.emergencyContact.relationship}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{patient.emergencyContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{patient.emergencyContact.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-600">No emergency contact information on file</p>
          )}
        </Card>

        {/* Additional Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Additional Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Occupation</label>
                <p className="text-gray-900">{patient.occupation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Employer</label>
                <p className="text-gray-900">{patient.employer || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Preferred Language</label>
                <p className="text-gray-900">{patient.preferredLanguage || 'English'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <p className="text-gray-900">
                  {patient.registrationDate ? 
                    new Date(patient.registrationDate.seconds * 1000).toLocaleDateString() : 
                    patient.createdAt ? new Date(patient.createdAt.seconds * 1000).toLocaleDateString() :
                    'N/A'
                  }
                </p>
              </div>
            </div>
            {patient.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-gray-900">{patient.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Recent Appointments</h3>
          {patientAppointments.length > 0 ? (
            <div className="space-y-2">
              {patientAppointments.slice(0, 3).map(apt => (
                <div key={apt.id} className="border-b pb-2">
                  <p className="font-semibold">{apt.doctorName}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                  <Badge>{apt.status || 'Scheduled'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments found</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Medical Records</h3>
          {patientRecords.length > 0 ? (
            <div className="space-y-2">
              {patientRecords.slice(0, 3).map(record => (
                <div key={record.id} className="border-b pb-2">
                  <p className="font-semibold">Record #{record.recordNumber}</p>
                  <p className="text-sm text-gray-500">{record.primaryDoctor}</p>
                  <Button size="sm" onClick={() => navigate(`/hospital/medical-records/${record.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medical records found</p>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <Button 
          onClick={() => navigate(`/hospital/medical-records/patient/${id}`)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          View Medical Records
        </Button>
        <Button 
          onClick={() => navigate(`/hospital/appointments/create?patientId=${id}`)}
          className="bg-green-600 hover:bg-green-700"
        >
          Schedule Appointment
        </Button>
        <Button 
          onClick={() => navigate(`/hospital/billing/patient/${id}`)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          View Billing
        </Button>
        <Button 
          onClick={() => navigate(`/hospital/lab/create?patientId=${id}`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Order Lab Tests
        </Button>
      </div>
    </>
  );
}