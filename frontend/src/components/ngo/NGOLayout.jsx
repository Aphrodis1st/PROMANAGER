import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Globe2,
  Network,
  ShieldCheck,
  DollarSign,
  Landmark,
  Shield,
  Briefcase,
  FileText,
  BarChart3,
  LayoutDashboard,
  MapPinned,
  Box,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { clearServiceAuth, getServiceUser, getServiceOrganization, CENTRAL_LOGIN_PATH } from '../../utils/authCookies.js';
import { getWorkspaceOrganization, getServiceLabel } from '../../config/serviceContext.js';
import { filterNgoMenuItems, isNgoPathAllowed, getDefaultNgoPath } from '../../config/ngoNavigationScopes.js';

/** Sidebar order: dashboard → structure → people → delivery → contracts/GIS → finance → impact → compliance */
const menuItems = [
  { path: '/ngo/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ngo/organizations', icon: Building2, label: 'Organization' },
  { path: '/ngo/branches', icon: Globe2, label: 'Branches' },
  { path: '/ngo/departments', icon: Network, label: 'Departments' },
  { path: '/ngo/roles', icon: ShieldCheck, label: 'Roles' },
  { path: '/ngo/staff', icon: Users, label: 'Staff' },
  { path: '/ngo/projects', icon: Briefcase, label: 'Projects & Tenders' },
  { path: '/ngo/contracts', icon: FileText, label: 'Contracts & Storage' },
  { path: '/ngo/gis', icon: MapPinned, label: 'Field GIS' },
  { path: '/ngo/finance', icon: DollarSign, label: 'Finance' },
  { path: '/ngo/impact', icon: BarChart3, label: 'Impact Valuation' },
  { path: '/ngo/audit', icon: Landmark, label: 'Audit' },
  { path: '/ngo/beneficial-owners', icon: Shield, label: 'Beneficial Owners' },
  { path: '/ngo/service-control', icon: Box, label: 'Service Control' },
  { path: '/ngo/settings', icon: Settings, label: 'Settings' }
];

function getUserInitials(user) {
  const name = user?.fullName || user?.name || user?.email || 'User';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getUserDisplayName(user) {
  return user?.fullName || user?.name || 'NGO Admin';
}

export default function NGOLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const user = getServiceUser('ngo');
  const organization = getWorkspaceOrganization('ngo', user) || getServiceOrganization('ngo');
  const serviceLabel = getServiceLabel('ngo', user);
  const visibleMenuItems = useMemo(() => filterNgoMenuItems(menuItems, user), [user]);

  useEffect(() => {
    if (!isNgoPathAllowed(location.pathname, user)) {
      navigate(getDefaultNgoPath(user), { replace: true });
    }
  }, [location.pathname, user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearServiceAuth('ngo');
    setUserMenuOpen(false);
    navigate(CENTRAL_LOGIN_PATH, { replace: true });
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 truncate max-w-[240px] sm:max-w-md">
                  {organization?.name || 'NGO Management'}
                </h1>
                <p className="text-xs text-gray-500">{serviceLabel} · Operations & compliance</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative"
              title="Notifications"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="h-8 w-px bg-gray-300" />

            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white">
                  {getUserInitials(user)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{getUserDisplayName(user)}</p>
                  <p className="text-xs text-gray-500">{user?.email || '—'}</p>
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-semibold text-gray-800">{getUserDisplayName(user)}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || '—'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <nav className="p-3 space-y-0.5">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={active ? 'text-emerald-600' : 'text-slate-600'} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
