import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Input } from '../../../components/hospital/Input';
import { Badge } from '../../../components/hospital/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/hospital/Dialog';
import { Label } from '../../../components/hospital/Label';
import { Plus, Edit, Trash2, UserCheck, Search, Lock, Eye, EyeOff, Copy, Check, AlertCircle, Shield, Users, Filter, Download, Upload, MoreVertical, UserPlus, UserMinus, RefreshCw, Calendar, Activity, Settings, Key, UserX, CheckSquare, Square, BarChart3, TrendingUp, Clock, MapPin, Phone, Mail, Building, Award, AlertTriangle, FileText, History } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';
import { HOSPITAL_DEPARTMENTS } from '../../../constants/hospitalDepartments';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAccessControlOpen, setIsAccessControlOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isImportUsersOpen, setIsImportUsersOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [auditLogs, setAuditLogs] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    usersByRole: {},
    usersByDepartment: {},
    loginActivity: [],
    recentActivity: []
  });
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    role: '',
    departmentId: '',
    phone: '',
    alternatePhone: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    licenseNumber: '',
    licenseExpiry: '',
    specialization: '',
    workSchedule: 'full-time',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    insuranceProvider: '',
    insuranceNumber: '',
    socialSecurityNumber: '',
    taxId: '',
    bankAccount: '',
    routingNumber: '',
    salary: '',
    hourlyRate: '',
    contractType: '',
    supervisor: '',
    shift: '',
    workLocation: '',
    skills: '',
    certifications: '',
    education: '',
    experience: '',
    languages: '',
    notes: '',
    profilePhoto: '',
    permissions: {},
    userType: 'staff',
    isActive: true,
    requirePasswordChange: true
  });
  const [editUser, setEditUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [partialPassword, setPartialPassword] = useState('');
  const [isPartialPasswordOpen, setIsPartialPasswordOpen] = useState(false);

  const roles = [
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'lab_technician', label: 'Lab Technician', icon: '🔬' },
    { value: 'pharmacist', label: 'Pharmacist', icon: '💊' },
    { value: 'receptionist', label: 'Receptionist', icon: '📋' },
    { value: 'admin', label: 'Administrator', icon: '⚙️' },
    { value: 'patient', label: 'Patient', icon: '🏥' }
  ];

  const featurePermissions = [
    { key: 'viewPatients', label: 'View Patients', category: 'Patient Management' },
    { key: 'editPatients', label: 'Edit Patients', category: 'Patient Management' },
    { key: 'deletePatients', label: 'Delete Patients', category: 'Patient Management' },
    { key: 'viewPrescriptions', label: 'View Prescriptions', category: 'Medical Records' },
    { key: 'createPrescriptions', label: 'Create Prescriptions', category: 'Medical Records' },
    { key: 'editPrescriptions', label: 'Edit Prescriptions', category: 'Medical Records' },
    { key: 'viewLabTests', label: 'View Lab Tests', category: 'Laboratory' },
    { key: 'orderLabTests', label: 'Order Lab Tests', category: 'Laboratory' },
    { key: 'viewLabResults', label: 'View Lab Results', category: 'Laboratory' },
    { key: 'viewReports', label: 'View Reports', category: 'Reports' },
    { key: 'generateReports', label: 'Generate Reports', category: 'Reports' },
    { key: 'exportReports', label: 'Export Reports', category: 'Reports' },
    { key: 'manageDepartment', label: 'Manage Department', category: 'Administration' },
    { key: 'manageStaff', label: 'Manage Staff', category: 'Administration' },
    { key: 'manageUsers', label: 'Manage Users', category: 'Administration' },
    { key: 'viewBilling', label: 'View Billing', category: 'Financial' },
    { key: 'manageBilling', label: 'Manage Billing', category: 'Financial' },
    { key: 'processPayments', label: 'Process Payments', category: 'Financial' },
    { key: 'viewAppointments', label: 'View Appointments', category: 'Scheduling' },
    { key: 'manageAppointments', label: 'Manage Appointments', category: 'Scheduling' },
    { key: 'scheduleAppointments', label: 'Schedule Appointments', category: 'Scheduling' },
    { key: 'viewInventory', label: 'View Inventory', category: 'Inventory' },
    { key: 'manageInventory', label: 'Manage Inventory', category: 'Inventory' },
    { key: 'systemSettings', label: 'System Settings', category: 'System' },
    { key: 'auditLogs', label: 'View Audit Logs', category: 'System' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hospitalToken');
      
      if (!token) {
        setErrorMessage('Authentication required. Redirecting to login...');
        setTimeout(() => navigate('/hospital/login'), 2000);
        return;
      }

      console.log('Fetching users...');
      // Fetch users from API
      const usersRes = await hospitalAdminService.getUserManagement();
      console.log('Users response:', usersRes);
      setUsers(usersRes.data || []);
      
      // Use departments from constants file
      console.log('Using departments from constants:', HOSPITAL_DEPARTMENTS.length, 'departments');
      setDepartments(HOSPITAL_DEPARTMENTS);
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.message.includes('No authentication token')) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => navigate('/hospital/login'), 2000);
      } else {
        setErrorMessage(error.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(user => user.departmentId === departmentFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'department':
          const deptA = departments.find(d => d.id === a.departmentId);
          const deptB = departments.find(d => d.id === b.departmentId);
          aValue = deptA ? deptA.name.toLowerCase() : '';
          bValue = deptB ? deptB.name.toLowerCase() : '';
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  // Generate partial password (first 4 characters visible)
  const generatePartialPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPartialPassword(password);
    return password;
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Role change functionality
  const handleRoleChange = async () => {
    try {
      await hospitalAdminService.updateUser(selectedUserForRole.id, {
        role: newRole
      });
      setSuccessMessage(`Role changed to ${roles.find(r => r.value === newRole)?.label} successfully`);
      setIsRoleChangeOpen(false);
      setSelectedUserForRole(null);
      setNewRole('');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to change role');
    }
  };

  const openRoleChange = (user) => {
    setSelectedUserForRole(user);
    setNewRole(user.role);
    setIsRoleChangeOpen(true);
  };

  const openPartialPasswordDialog = (user) => {
    setSelectedUser(user);
    setPartialPassword('');
    setIsPartialPasswordOpen(true);
  };

  const handlePartialPasswordReset = async () => {
    try {
      const fullPassword = generatePartialPassword();
      await hospitalAdminService.resetUserPassword(selectedUser.id, fullPassword);
      setSuccessMessage('Partial password set successfully. User can complete setup on first login.');
      setIsPartialPasswordOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to set partial password');
    }
  };

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      setErrorMessage('Please select users first');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedUsers.map(userId => 
            hospitalAdminService.toggleUserAccess(userId)
          ));
          setSuccessMessage(`${selectedUsers.length} users activated`);
          break;
        case 'deactivate':
          await Promise.all(selectedUsers.map(userId => 
            hospitalAdminService.toggleUserAccess(userId)
          ));
          setSuccessMessage(`${selectedUsers.length} users deactivated`);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
            await Promise.all(selectedUsers.map(userId => 
              hospitalAdminService.deleteUser(userId)
            ));
            setSuccessMessage(`${selectedUsers.length} users deleted`);
          }
          break;
        default:
          break;
      }
      setSelectedUsers([]);
      setIsBulkActionsOpen(false);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Bulk operation failed');
    }
  };

  // Export users data
  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Created Date'],
      ...filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        departments.find(d => d.id === user.departmentId)?.name || 'N/A',
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!generatedPassword) {
      setErrorMessage('Please generate a password');
      return;
    }

    // Check if user with same email already exists
    const existingUser = users.find(user => 
      user.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (existingUser) {
      setErrorMessage(`A user with email "${newUser.email}" already exists. Please use a different email address.`);
      return;
    }

    // Check if employee ID already exists (if provided)
    if (newUser.employeeId) {
      const existingEmployeeId = users.find(user => 
        user.employeeId && user.employeeId.toLowerCase() === newUser.employeeId.toLowerCase()
      );
      if (existingEmployeeId) {
        setErrorMessage(`Employee ID "${newUser.employeeId}" is already in use. Please use a different employee ID.`);
        return;
      }
    }

    try {
      setLoading(true);
      await hospitalAdminService.createUser({
        ...newUser,
        password: generatedPassword
      });
      setSuccessMessage('User created successfully');
      setIsCreateDialogOpen(false);
      // Reset form
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        role: '',
        departmentId: '',
        phone: '',
        alternatePhone: '',
        employeeId: '',
        startDate: '',
        endDate: '',
        licenseNumber: '',
        licenseExpiry: '',
        specialization: '',
        workSchedule: 'full-time',
        emergencyContact: '',
        emergencyPhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        bloodGroup: '',
        allergies: '',
        medicalHistory: '',
        insuranceProvider: '',
        insuranceNumber: '',
        socialSecurityNumber: '',
        taxId: '',
        bankAccount: '',
        routingNumber: '',
        salary: '',
        hourlyRate: '',
        contractType: '',
        supervisor: '',
        shift: '',
        workLocation: '',
        skills: '',
        certifications: '',
        education: '',
        experience: '',
        languages: '',
        notes: '',
        profilePhoto: '',
        permissions: {},
        userType: 'staff',
        isActive: true,
        requirePasswordChange: true
      });
      setGeneratedPassword('');
      setPasswordCopied(false);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Create user error:', error);
      if (error.message.includes('User already exists')) {
        setErrorMessage(`A user with email "${newUser.email}" already exists. Please use a different email address.`);
      } else if (error.message.includes('Employee ID already exists')) {
        setErrorMessage(`Employee ID "${newUser.employeeId}" is already in use. Please use a different employee ID.`);
      } else {
        setErrorMessage(error.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await hospitalAdminService.updateUser(editUser.id, {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        phone: editUser.phone,
        departmentId: editUser.departmentId,
        role: editUser.role,
        employeeId: editUser.employeeId
      });
      setSuccessMessage('User updated successfully');
      setIsEditDialogOpen(false);
      setEditUser(null);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await hospitalAdminService.deleteUser(userId);
        setSuccessMessage('User deleted successfully');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete user');
      }
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await hospitalAdminService.resetUserPassword(userId, newPassword);
      setSuccessMessage('Password reset successfully');
      setIsPasswordResetOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to reset password');
    }
  };

  const handleToggleAccess = async (userId) => {
    try {
      await hospitalAdminService.toggleUserAccess(userId);
      setSuccessMessage('User access updated successfully');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update user access');
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      await hospitalAdminService.updatePermissions(selectedUser.id, userPermissions);
      setSuccessMessage('Permissions updated successfully');
      setIsAccessControlOpen(false);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update permissions');
    }
  };

  const openAccessControl = (user) => {
    setSelectedUser(user);
    setUserPermissions(user.permissions || {});
    setIsAccessControlOpen(true);
  };

  const openEditDialog = (user) => {
    setEditUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const openPasswordReset = (user) => {
    setSelectedUser(user);
    setGeneratedPassword('');
    setIsPasswordResetOpen(true);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      doctor: 'bg-blue-100 text-blue-800 border-blue-200',
      nurse: 'bg-green-100 text-green-800 border-green-200',
      lab_technician: 'bg-purple-100 text-purple-800 border-purple-200',
      pharmacist: 'bg-orange-100 text-orange-800 border-orange-200',
      receptionist: 'bg-pink-100 text-pink-800 border-pink-200',
      admin: 'bg-red-100 text-red-800 border-red-200',
      patient: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserStats = () => {
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {}
    };
    
    roles.forEach(role => {
      stats.byRole[role.value] = users.filter(u => u.role === role.value).length;
    });
    
    return stats;
  };

  const stats = getUserStats();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New {newUser.userType === 'staff' ? 'Staff Member' : 'User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={newUser.middleName}
                    onChange={(e) => setNewUser({...newUser, middleName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => {
                      setNewUser({...newUser, email: e.target.value});
                      // Clear error when user starts typing
                      if (errorMessage.includes('email')) {
                        setErrorMessage('');
                      }
                    }}
                    required
                    className={users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase()) ? 'border-red-500' : ''}
                  />
                  {users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase()) && newUser.email && (
                    <p className="text-sm text-red-600 mt-1">This email is already registered</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) => setNewUser({...newUser, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={newUser.nationality}
                    onChange={(e) => setNewUser({...newUser, nationality: e.target.value})}
                    placeholder="e.g., American, Canadian"
                  />
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <select
                    value={newUser.bloodGroup}
                    onChange={(e) => setNewUser({...newUser, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role and Department */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="userType">User Type *</Label>
                  <select
                    value={newUser.userType}
                    onChange={(e) => setNewUser({...newUser, userType: e.target.value, role: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="staff">Staff Member</option>
                    <option value="user">General User</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select role</option>
                    {roles
                      .filter(role => newUser.userType === 'staff' ? ['doctor', 'nurse', 'lab_technician', 'pharmacist', 'receptionist', 'admin'].includes(role.value) : ['patient'].includes(role.value))
                      .map(role => (
                        <option key={role.value} value={role.value}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <select
                    value={newUser.departmentId}
                    onChange={(e) => setNewUser({...newUser, departmentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department (optional)</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Staff-Specific Information */}
            {newUser.userType === 'staff' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
                      placeholder="EMP001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newUser.startDate}
                      onChange={(e) => setNewUser({...newUser, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newUser.endDate}
                      onChange={(e) => setNewUser({...newUser, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="workSchedule">Work Schedule</Label>
                    <select
                      value={newUser.workSchedule}
                      onChange={(e) => setNewUser({...newUser, workSchedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="on-call">On Call</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="shift">Shift</Label>
                    <select
                      value={newUser.shift}
                      onChange={(e) => setNewUser({...newUser, shift: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select shift</option>
                      <option value="day">Day Shift (7AM - 7PM)</option>
                      <option value="night">Night Shift (7PM - 7AM)</option>
                      <option value="rotating">Rotating Shifts</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input
                      id="supervisor"
                      value={newUser.supervisor}
                      onChange={(e) => setNewUser({...newUser, supervisor: e.target.value})}
                      placeholder="Dr. Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workLocation">Work Location</Label>
                    <Input
                      id="workLocation"
                      value={newUser.workLocation}
                      onChange={(e) => setNewUser({...newUser, workLocation: e.target.value})}
                      placeholder="Main Hospital, Floor 3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information */}
            {newUser.userType === 'staff' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={newUser.licenseNumber}
                      onChange={(e) => setNewUser({...newUser, licenseNumber: e.target.value})}
                      placeholder="Medical license number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiry">License Expiry</Label>
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={newUser.licenseExpiry}
                      onChange={(e) => setNewUser({...newUser, licenseExpiry: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={newUser.specialization}
                      onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                      placeholder="Cardiology, Pediatrics, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newUser.experience}
                      onChange={(e) => setNewUser({...newUser, experience: e.target.value})}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={newUser.education}
                      onChange={(e) => setNewUser({...newUser, education: e.target.value})}
                      placeholder="MD from Harvard Medical School"
                    />
                  </div>
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      value={newUser.certifications}
                      onChange={(e) => setNewUser({...newUser, certifications: e.target.value})}
                      placeholder="Board Certified, CPR, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      value={newUser.skills}
                      onChange={(e) => setNewUser({...newUser, skills: e.target.value})}
                      placeholder="Surgery, Patient Care, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      value={newUser.languages}
                      onChange={(e) => setNewUser({...newUser, languages: e.target.value})}
                      placeholder="English, Spanish, French"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    value={newUser.allergies}
                    onChange={(e) => setNewUser({...newUser, allergies: e.target.value})}
                    placeholder="Penicillin, Peanuts, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Input
                    id="medicalHistory"
                    value={newUser.medicalHistory}
                    onChange={(e) => setNewUser({...newUser, medicalHistory: e.target.value})}
                    placeholder="Diabetes, Hypertension, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={newUser.insuranceProvider}
                    onChange={(e) => setNewUser({...newUser, insuranceProvider: e.target.value})}
                    placeholder="Blue Cross Blue Shield"
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    value={newUser.insuranceNumber}
                    onChange={(e) => setNewUser({...newUser, insuranceNumber: e.target.value})}
                    placeholder="ABC123456789"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            {newUser.userType === 'staff' && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary">Annual Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newUser.salary}
                      onChange={(e) => setNewUser({...newUser, salary: e.target.value})}
                      placeholder="75000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={newUser.hourlyRate}
                      onChange={(e) => setNewUser({...newUser, hourlyRate: e.target.value})}
                      placeholder="35.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractType">Contract Type</Label>
                    <select
                      value={newUser.contractType}
                      onChange={(e) => setNewUser({...newUser, contractType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select contract type</option>
                      <option value="permanent">Permanent</option>
                      <option value="temporary">Temporary</option>
                      <option value="contract">Contract</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="socialSecurityNumber">SSN</Label>
                    <Input
                      id="socialSecurityNumber"
                      value={newUser.socialSecurityNumber}
                      onChange={(e) => setNewUser({...newUser, socialSecurityNumber: e.target.value})}
                      placeholder="XXX-XX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={newUser.taxId}
                      onChange={(e) => setNewUser({...newUser, taxId: e.target.value})}
                      placeholder="12-3456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccount">Bank Account</Label>
                    <Input
                      id="bankAccount"
                      value={newUser.bankAccount}
                      onChange={(e) => setNewUser({...newUser, bankAccount: e.target.value})}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Additional Notes */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </h3>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={newUser.notes}
                  onChange={(e) => setNewUser({...newUser, notes: e.target.value})}
                  placeholder="Any additional notes or comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>

            {/* Password Generation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Initial Password
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={generatedPassword}
                    readOnly
                    placeholder="Generate password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="button" onClick={generatePassword} variant="outline">
                  Generate
                </Button>
              </div>
              {generatedPassword && (
                <Button
                  type="button"
                  onClick={copyPassword}
                  variant="outline"
                  className="w-full"
                >
                  {passwordCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Password
                    </>
                  )}
                </Button>
              )}
              <p className="text-sm text-gray-600">User can change password after first login</p>
            </div>

            <Button type="submit" className="w-full">Create {newUser.userType === 'staff' ? 'Staff Member' : 'User'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="info">{selectedUsers.length} selected</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedUsers.length === filteredUsers.length ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                Select All
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="role">Sort by Role</option>
                <option value="department">Sort by Department</option>
                <option value="created">Sort by Created Date</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No users found</p>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 rounded"
                      />
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.employeeId && (
                          <div className="text-sm text-gray-500">ID: {user.employeeId}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>

                      {user.departmentId && (
                        <Badge variant="outline">
                          {departments.find(d => d.id === user.departmentId)?.name || 'Department'}
                        </Badge>
                      )}

                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAccess(user.id)}
                          className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleChange(user)}
                          title="Change Role"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPartialPasswordDialog(user)}
                          title="Set Partial Password"
                        >
                          <Key className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPasswordReset(user)}
                          title="Reset Password"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>

                        <Dialog open={isAccessControlOpen && selectedUser?.id === user.id} onOpenChange={setIsAccessControlOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAccessControl(user)}
                              title="Manage Access & Permissions"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Access Control - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3">Feature Permissions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {featurePermissions.map(perm => (
                                    <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={userPermissions[perm.key] || false}
                                        onChange={(e) => setUserPermissions({
                                          ...userPermissions,
                                          [perm.key]: e.target.checked
                                        })}
                                        className="w-4 h-4 rounded"
                                      />
                                      <span className="text-sm">{perm.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <Button onClick={handleUpdatePermissions} className="w-full">
                                Save Permissions
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isEditDialogOpen && editUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            {editUser && (
                              <form onSubmit={handleEditUser} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>First Name</Label>
                                    <Input
                                      value={editUser.firstName}
                                      onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Last Name</Label>
                                    <Input
                                      value={editUser.lastName}
                                      onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label>Role</Label>
                                  <select
                                    value={editUser.role}
                                    onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    {roles.map(role => (
                                      <option key={role.value} value={role.value}>
                                        {role.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <Label>Department</Label>
                                  <select
                                    value={editUser.departmentId || ''}
                                    onChange={(e) => setEditUser({...editUser, departmentId: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select department</option>
                                    {departments.map(dept => (
                                      <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <Label>Phone</Label>
                                  <Input
                                    value={editUser.phone || ''}
                                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                                  />
                                </div>

                                <Button type="submit" className="w-full">Save Changes</Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Password Reset</span>
              </div>
              <p className="text-sm text-yellow-700">
                This will generate a new temporary password for the user. They will need to change it on first login.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={generatedPassword}
                    readOnly
                    placeholder="Generate new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="button" onClick={generatePassword} variant="outline">
                  Generate
                </Button>
              </div>
              {generatedPassword && (
                <Button
                  type="button"
                  onClick={copyPassword}
                  variant="outline"
                  className="w-full"
                >
                  {passwordCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Password
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsPasswordResetOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleResetPassword(selectedUser?.id, generatedPassword)}
                disabled={!generatedPassword}
                className="flex-1"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={isRoleChangeOpen} onOpenChange={setIsRoleChangeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Role - {selectedUserForRole?.firstName} {selectedUserForRole?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Role Change</span>
              </div>
              <p className="text-sm text-blue-700">
                Current Role: <strong>{roles.find(r => r.value === selectedUserForRole?.role)?.label}</strong>
              </p>
            </div>
            
            <div>
              <Label>New Role</Label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsRoleChangeOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRoleChange}
                disabled={newRole === selectedUserForRole?.role}
                className="flex-1"
              >
                Change Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Partial Password Dialog */}
      <Dialog open={isPartialPasswordOpen} onOpenChange={setIsPartialPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Partial Password - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Partial Password Setup</span>
              </div>
              <p className="text-sm text-green-700">
                This will set a temporary partial password. The user will be required to complete their password setup on first login.
              </p>
            </div>
            
            {partialPassword && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Label className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4" />
                  Generated Partial Password
                </Label>
                <div className="font-mono text-lg bg-white p-2 rounded border">
                  {partialPassword.substring(0, 4)}****
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Only first 4 characters shown. Full password will be sent securely.
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsPartialPasswordOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePartialPasswordReset}
                className="flex-1"
              >
                {partialPassword ? 'Set Password' : 'Generate & Set'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
