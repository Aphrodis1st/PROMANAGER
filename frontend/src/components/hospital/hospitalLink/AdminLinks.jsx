import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  Shield, 
  BarChart3, 
  User,
  Building2,
  UserCheck,
  Calendar,
  Plus,
  Lock
} from 'lucide-react';
import { useHospitalAuth } from '../../../context/HospitalAuthContext';

const AdminLinks = () => {
  const location = useLocation();
  const { admin } = useHospitalAuth();

  // Only show admin links if user is hospital admin (accept both roles)
  if (!admin || (admin.role !== 'hospital_admin' && admin.role !== 'admin')) {
    return null;
  }

  const adminLinks = [
    {
      title: 'Admin Dashboard',
      path: '/hospital/admin/dashboard',
      icon: BarChart3,
      description: 'Hospital administration overview'
    },
    {
      title: 'Admin Profile',
      path: '/hospital/admin/profile',
      icon: User,
      description: 'Manage your admin profile'
    },
    {
      title: 'Hospital Settings',
      path: '/hospital/admin/settings',
      icon: Settings,
      description: 'Configure hospital settings'
    },
    {
      title: 'Analytics',
      path: '/hospital/admin/analytics',
      icon: BarChart3,
      description: 'View detailed analytics'
    },
    {
      title: 'User Management',
      path: '/hospital/admin/users',
      icon: Users,
      description: 'Manage hospital users'
    },
    {
      title: 'Department Management',
      path: '/hospital/admin/departments',
      icon: Building2,
      description: 'Manage departments'
    },
    {
      title: 'Staff Management',
      path: '/hospital/admin/staff',
      icon: UserCheck,
      description: 'Manage hospital staff'
    },
    {
      title: 'Patient Management',
      path: '/hospital/admin/patients',
      icon: Users,
      description: 'Advanced patient management'
    },
    {
      title: 'Appointment System',
      path: '/hospital/admin/appointments',
      icon: Calendar,
      description: 'Appointment system configuration'
    },
    {
      title: 'Sub Admin Management',
      path: '/hospital/admin/sub-admin',
      icon: Plus,
      description: 'Manage sub-administrators'
    },
    {
      title: 'Access Control',
      path: '/hospital/admin/access-control',
      icon: Lock,
      description: 'Manage user permissions'
    }
  ];

  return (
    <li>
      <div className="mb-2">
        <div className="flex items-center px-3 py-2 text-xs font-semibold text-white/80 uppercase tracking-wider">
          <Shield className="w-4 h-4 mr-2" />
          Administration
        </div>
      </div>
      <ul className="space-y-1 ml-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`
                  flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 text-white font-medium shadow-lg' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
                title={link.description}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">{link.title}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default AdminLinks;