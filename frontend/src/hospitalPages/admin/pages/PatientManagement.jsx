import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Input } from '../../../components/hospital/Input';
import { Badge } from '../../../components/hospital/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/hospital/Dialog';
import { Users, Search, Eye, Edit, Calendar, FileText } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, statusFilter]);

  const fetchPatients = async () => {
    try {
      const response = await hospitalAdminService.getPatientManagement();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => {
        if (statusFilter === 'active') return patient.isActive !== false;
        if (statusFilter === 'inactive') return patient.isActive === false;
        return true;
      });
    }

    setFilteredPatients(filtered);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  const getPatientAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Total Patients: {patients.length}
          </Badge>
          <Button onClick={() => window.location.href = '/hospital/patients/create'}>
            Add New Patient
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {patients.filter(p => p.isActive !== false).length}
            </div>
            <div className="text-sm text-gray-600">Active Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.gender === 'male').length}
            </div>
            <div className="text-sm text-gray-600">Male Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-pink-600">
              {patients.filter(p => p.gender === 'female').length}
            </div>
            <div className="text-sm text-gray-600">Female Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {patients.filter(p => {
                const age = getPatientAge(p.dateOfBirth);
                return age !== 'N/A' && age < 18;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Pediatric Patients</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.email} • {patient.phone}
                    </div>
                    <div className="text-xs text-gray-400">
                      Age: {getPatientAge(patient.dateOfBirth)} • 
                      Gender: {patient.gender || 'N/A'} • 
                      Registered: {formatDate(patient.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={patient.isActive !== false ? 'default' : 'secondary'}>
                    {patient.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(patient)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/hospital/patients/${patient.id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/hospital/medical-records?patientId=${patient.id}`}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/hospital/appointments?patientId=${patient.id}`}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedPatient.firstName} {selectedPatient.lastName}</div>
                    <div><span className="font-medium">Email:</span> {selectedPatient.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedPatient.phone}</div>
                    <div><span className="font-medium">Age:</span> {getPatientAge(selectedPatient.dateOfBirth)}</div>
                    <div><span className="font-medium">Gender:</span> {selectedPatient.gender || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Medical Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Blood Type:</span> {selectedPatient.bloodType || 'N/A'}</div>
                    <div><span className="font-medium">Allergies:</span> {selectedPatient.allergies || 'None recorded'}</div>
                    <div><span className="font-medium">Emergency Contact:</span> {selectedPatient.emergencyContact || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Address</h3>
                <div className="text-sm text-gray-600">
                  {selectedPatient.address || 'No address recorded'}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Insurance Information</h3>
                <div className="text-sm text-gray-600">
                  {selectedPatient.insuranceProvider ? (
                    <div>
                      <div>Provider: {selectedPatient.insuranceProvider}</div>
                      <div>Policy Number: {selectedPatient.insurancePolicyNumber || 'N/A'}</div>
                    </div>
                  ) : (
                    'No insurance information recorded'
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  onClick={() => window.location.href = `/hospital/patients/${selectedPatient.id}/edit`}
                  className="flex-1"
                >
                  Edit Patient
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = `/hospital/medical-records?patientId=${selectedPatient.id}`}
                  className="flex-1"
                >
                  View Medical Records
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start by adding your first patient.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => window.location.href = '/hospital/patients/create'}>
                Add New Patient
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientManagement;