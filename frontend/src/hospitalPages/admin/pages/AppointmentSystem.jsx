import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Input } from '../../../components/hospital/Input';
import { Badge } from '../../../components/hospital/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/hospital/Dialog';
import { Calendar, Search, Eye, Clock, User, Stethoscope, CalendarDays } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';

const AppointmentSystem = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const appointmentStatuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'no_show', label: 'No Show', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      const response = await hospitalAdminService.getAppointmentSystem();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointmentType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const appointmentDate = new Date(appointment.appointmentDate);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(appointment => {
            const appDate = new Date(appointment.appointmentDate);
            return appDate.toDateString() === today.toDateString();
          });
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filtered = filtered.filter(appointment => {
            const appDate = new Date(appointment.appointmentDate);
            return appDate.toDateString() === tomorrow.toDateString();
          });
          break;
        case 'this_week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          filtered = filtered.filter(appointment => {
            const appDate = new Date(appointment.appointmentDate);
            return appDate >= weekStart && appDate <= weekEnd;
          });
          break;
      }
    }

    setFilteredAppointments(filtered);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadgeColor = (status) => {
    const statusObj = appointmentStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAppointmentStats = () => {
    const today = new Date().toDateString();
    return {
      total: appointments.length,
      today: appointments.filter(a => new Date(a.appointmentDate).toDateString() === today).length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const stats = getAppointmentStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointment System</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Total: {appointments.length}
          </Badge>
          <Button onClick={() => window.location.href = '/hospital/appointments/create'}>
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Appointment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.today}</div>
                <div className="text-sm text-gray-600">Today's Appointments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
                <div className="text-sm text-gray-600">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Statuses</option>
              {appointmentStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_week">This Week</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {appointment.patientName || 'Unknown Patient'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dr. {appointment.doctorName || 'Unknown Doctor'} • 
                      {appointment.appointmentType || 'General Consultation'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDateTime(appointment.appointmentDate)} • 
                      Duration: {appointment.duration || 30} minutes
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusBadgeColor(appointment.status)}>
                    {appointmentStatuses.find(s => s.value === appointment.status)?.label || appointment.status}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/hospital/appointments/${appointment.id}/edit`}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedAppointment.patientName}</div>
                    <div><span className="font-medium">Phone:</span> {selectedAppointment.patientPhone || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedAppointment.patientEmail || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Doctor Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Doctor:</span> Dr. {selectedAppointment.doctorName}</div>
                    <div><span className="font-medium">Department:</span> {selectedAppointment.department || 'N/A'}</div>
                    <div><span className="font-medium">Specialization:</span> {selectedAppointment.specialization || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Appointment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Date & Time:</span> {formatDateTime(selectedAppointment.appointmentDate)}</div>
                  <div><span className="font-medium">Duration:</span> {selectedAppointment.duration || 30} minutes</div>
                  <div><span className="font-medium">Type:</span> {selectedAppointment.appointmentType}</div>
                  <div><span className="font-medium">Status:</span> 
                    <Badge className={`ml-2 ${getStatusBadgeColor(selectedAppointment.status)}`}>
                      {appointmentStatuses.find(s => s.value === selectedAppointment.status)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.reason && (
                <div>
                  <h3 className="font-medium mb-2">Reason for Visit</h3>
                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                    {selectedAppointment.reason}
                  </div>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  onClick={() => window.location.href = `/hospital/appointments/${selectedAppointment.id}/edit`}
                  className="flex-1"
                >
                  Edit Appointment
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsDetailsDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start by scheduling your first appointment.'}
            </p>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Button onClick={() => window.location.href = '/hospital/appointments/create'}>
                Schedule Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentSystem;