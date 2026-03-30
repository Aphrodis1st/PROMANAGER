import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/hospital/card';
import { Button } from '../../components/hospital/Button';
import { Badge } from '../../components/hospital/Badge';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Clock,
  UserCheck,
  Stethoscope,
  Pill,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Shield,
  Settings,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  console.log('Dashboard - Current user:', user, 'Loading:', loading);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No user data found</h2>
          <p className="text-gray-600">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const loadDashboardData = async () => {
    const mockStats = {
      admin: {
        totalUsers: 245,
        totalPatients: 1250,
        totalDoctors: 45,
        totalAppointments: 89,
        revenue: 125000,
        departments: 8
      },
      doctor: {
        todayAppointments: 12,
        totalPatients: 156,
        pendingReports: 8,
        completedToday: 7
      },
      nurse: {
        assignedPatients: 15,
        medicationsToday: 28,
        vitalsChecked: 12,
        pendingTasks: 5
      },
      receptionist: {
        todayAppointments: 45,
        waitingPatients: 8,
        checkedIn: 23,
        pendingScheduling: 12
      }
    };

    const mockActivities = [
      { id: 1, type: 'appointment', message: 'New appointment scheduled', time: '10 minutes ago' },
      { id: 2, type: 'patient', message: 'Patient John Doe checked in', time: '25 minutes ago' },
      { id: 3, type: 'report', message: 'Lab report completed', time: '1 hour ago' },
      { id: 4, type: 'medication', message: 'Medication administered', time: '2 hours ago' }
    ];

    setStats(mockStats);
    setRecentActivities(mockActivities);
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      cardiology: Heart,
      neurology: Brain,
      ophthalmology: Eye,
      orthopedics: Bone,
      pediatrics: Baby,
      emergency: Shield,
      general: Stethoscope
    };
    return icons[department?.toLowerCase()] || Stethoscope;
  };

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.admin?.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">{stats.admin?.totalPatients}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${stats.admin?.revenue?.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{stats.admin?.departments}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Doctors</span>
                <Badge variant="outline">{stats.admin?.totalDoctors}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Today's Appointments</span>
                <Badge variant="outline">{stats.admin?.totalAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>System Status</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-12">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="h-12">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="h-12">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => {
    const DepartmentIcon = getDepartmentIcon(user?.department?.name);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold">{stats.doctor?.todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">{stats.doctor?.totalPatients}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold">{stats.doctor?.pendingReports}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold">{stats.doctor?.completedToday}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DepartmentIcon className="h-5 w-5" />
                {user?.department?.name || 'General'} Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Department Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Next Appointment</span>
                  <Badge variant="outline">2:30 PM</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Emergency Calls</span>
                  <Badge variant="outline">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline" className="h-12">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Patients
                </Button>
                <Button variant="outline" className="h-12">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </Button>
                <Button variant="outline" className="h-12">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Consultations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderNurseDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Patients</p>
                <p className="text-2xl font-bold">{stats.nurse?.assignedPatients}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medications Today</p>
                <p className="text-2xl font-bold">{stats.nurse?.medicationsToday}</p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vitals Checked</p>
                <p className="text-2xl font-bold">{stats.nurse?.vitalsChecked}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold">{stats.nurse?.pendingTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Patient Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Critical Patients</span>
                <Badge variant="destructive">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Stable Patients</span>
                <Badge className="bg-green-100 text-green-800">13</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Discharge Ready</span>
                <Badge variant="outline">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <UserCheck className="h-4 w-4 mr-2" />
                Patient List
              </Button>
              <Button variant="outline" className="h-12">
                <Pill className="h-4 w-4 mr-2" />
                Medications
              </Button>
              <Button variant="outline" className="h-12">
                <Activity className="h-4 w-4 mr-2" />
                Vital Signs
              </Button>
              <Button variant="outline" className="h-12">
                <Clock className="h-4 w-4 mr-2" />
                Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReceptionistDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold">{stats.receptionist?.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting Patients</p>
                <p className="text-2xl font-bold">{stats.receptionist?.waitingPatients}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold">{stats.receptionist?.checkedIn}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Scheduling</p>
                <p className="text-2xl font-bold">{stats.receptionist?.pendingScheduling}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Next Appointment</span>
                <Badge variant="outline">2:00 PM</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Available Slots</span>
                <Badge className="bg-green-100 text-green-800">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancellations</span>
                <Badge variant="outline">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" className="h-12">
                <UserCheck className="h-4 w-4 mr-2" />
                Check-in
              </Button>
              <Button variant="outline" className="h-12">
                <Users className="h-4 w-4 mr-2" />
                Patient List
              </Button>
              <Button variant="outline" className="h-12">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'doctor':
        return renderDoctorDashboard();
      case 'nurse':
        return renderNurseDashboard();
      case 'receptionist':
        return renderReceptionistDashboard();
      default:
        return renderDoctorDashboard();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} - {user?.department?.name || 'General'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user?.role}
          </Badge>
          {user?.department && (
            <Badge variant="secondary">
              {user.department.name}
            </Badge>
          )}
        </div>
      </div>

      {renderDashboardByRole()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm">{activity.message}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;