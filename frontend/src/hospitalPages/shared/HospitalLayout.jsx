import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/hospital/Button';
import { Badge } from '../../components/hospital/Badge';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  UserCheck,
  Stethoscope,
  Pill,
  Activity,
  Clock,
  CreditCard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  Building2,
  ClipboardList,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby
} from 'lucide-react';

const HospitalLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    return icons[department?.toLowerCase()] || Building2;
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/hospital/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'doctor', 'nurse', 'receptionist']
      },
      {
        name: 'Profile',
        href: '/hospital/profile',
        icon: User,
        roles: ['admin', 'doctor', 'nurse', 'receptionist']
      },
      {
        name: 'Notifications',
        href: '/hospital/notifications',
        icon: Bell,
        roles: ['admin', 'doctor', 'nurse', 'receptionist']
      }
    ];

    const roleSpecificItems = {
      admin: [
        {
          name: 'User Management',
          href: '/hospital/users',
          icon: Users,
          roles: ['admin']
        },
        {
          name: 'Departments',
          href: '/hospital/departments',
          icon: Building2,
          roles: ['admin']
        },
        {
          name: 'System Settings',
          href: '/hospital/settings',
          icon: Settings,
          roles: ['admin']
        },
        {
          name: 'Reports',
          href: '/hospital/reports',
          icon: BarChart3,
          roles: ['admin']
        },
        {
          name: 'Audit Logs',
          href: '/hospital/audit-logs',
          icon: Shield,
          roles: ['admin']
        }
      ],
      doctor: [
        {
          name: 'Doctor Dashboard',
          href: '/hospital/doctor/dashboard',
          icon: Stethoscope,
          roles: ['doctor']
        },
        {
          name: 'Patients',
          href: '/hospital/patients',
          icon: UserCheck,
          roles: ['doctor']
        },
        {
          name: 'Appointments',
          href: '/hospital/appointments',
          icon: Calendar,
          roles: ['doctor']
        },
        {
          name: 'Medical Records',
          href: '/hospital/medical-records',
          icon: FileText,
          roles: ['doctor']
        },
        {
          name: 'Prescriptions',
          href: '/hospital/prescriptions',
          icon: Pill,
          roles: ['doctor']
        },
        {
          name: 'Lab Results',
          href: '/hospital/lab-results',
          icon: ClipboardList,
          roles: ['doctor']
        }
      ],
      nurse: [
        {
          name: 'Nurse Dashboard',
          href: '/hospital/nurse/dashboard',
          icon: Heart,
          roles: ['nurse']
        },
        {
          name: 'Patient Care',
          href: '/hospital/patient-care',
          icon: UserCheck,
          roles: ['nurse']
        },
        {
          name: 'Medications',
          href: '/hospital/medications',
          icon: Pill,
          roles: ['nurse']
        },
        {
          name: 'Vital Signs',
          href: '/hospital/vital-signs',
          icon: Activity,
          roles: ['nurse']
        },
        {
          name: 'Nursing Notes',
          href: '/hospital/nursing-notes',
          icon: FileText,
          roles: ['nurse']
        }
      ],
      receptionist: [
        {
          name: 'Reception Dashboard',
          href: '/hospital/receptionist/dashboard',
          icon: Calendar,
          roles: ['receptionist']
        },
        {
          name: 'Appointment Booking',
          href: '/hospital/booking',
          icon: Calendar,
          roles: ['receptionist']
        },
        {
          name: 'Patient Registration',
          href: '/hospital/registration',
          icon: UserCheck,
          roles: ['receptionist']
        },
        {
          name: 'Check-in',
          href: '/hospital/check-in',
          icon: Clock,
          roles: ['receptionist']
        },
        {
          name: 'Billing',
          href: '/hospital/billing',
          icon: CreditCard,
          roles: ['receptionist']
        }
      ]
    };

    const userRole = user?.role;
    const roleItems = roleSpecificItems[userRole] || [];
    
    return [...baseItems, ...roleItems].filter(item => 
      item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();
  const DepartmentIcon = getDepartmentIcon(user?.department?.name);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">MedSmart</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DepartmentIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {user?.role}
                  </Badge>
                  {user?.department && (
                    <Badge variant="secondary" className="text-xs">
                      {user.department.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  Hospital Management System
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Department indicator */}
              {user?.department && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <DepartmentIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.department.name}</span>
                </div>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.firstName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;