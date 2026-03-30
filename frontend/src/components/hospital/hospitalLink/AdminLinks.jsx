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
import { useRBAC, ProtectedComponent, PERMISSIONS } from '../RBAC';

const AdminLinks = () => {
  const location = useLocation();
  const { hasPermission } = useRBAC();

  const adminLinks = [
    {
      title: 'User Management',
      path: '/hospital/admin/users',
      icon: Users,
      description: 'Manage hospital users',
      permission: PERMISSIONS.MANAGE_USERS
    },
    {
      title: 'Department Management',
      path: '/hospital/admin/departments',
      icon: Building2,
      description: 'Manage departments',
      permission: PERMISSIONS.MANAGE_DEPARTMENTS
    },
    {
      title: 'System Settings',
      path: '/hospital/admin/settings',
      icon: Settings,
      description: 'Configure system settings',
      permission: PERMISSIONS.SYSTEM_SETTINGS
    },
    {
      title: 'Audit Logs',
      path: '/hospital/admin/audit',
      icon: Lock,
      description: 'View system audit logs',
      permission: PERMISSIONS.VIEW_AUDIT_LOGS
    }
  ];

  // Filter links based on permissions
  const visibleLinks = adminLinks.filter(link => hasPermission(link.permission));

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <li>
      <div className="mb-2">
        <div className="flex items-center px-3 py-2 text-xs font-semibold text-white/80 uppercase tracking-wider">
          <Shield className="w-4 h-4 mr-2" />
          Administration
        </div>
      </div>
      <ul className="space-y-1 ml-2">
        {visibleLinks.map((link) => {
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