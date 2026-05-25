import React, { useState } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminHospitalAdminsQuery,
  useGetSuperAdminHospitalsQuery,
  useGetSuperAdminStocksQuery,
  useGetSuperAdminPharmaciesQuery,
  useGetSuperAdminNGOsQuery,
  useGetSuperAdminHROrganizationsQuery,
  useGetSuperAdminPropertyOrganizationsQuery,
  useCreateSuperAdminHospitalAdminMutation,
  useUpdateSuperAdminHospitalAdminStatusMutation,
  useReassignSuperAdminHospitalAdminMutation,
  useResetSuperAdminHospitalAdminPasswordMutation,
  useDeleteSuperAdminHospitalAdminMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';

const ENTITY_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'stock', label: 'Stock' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'ngo', label: 'NGO' },
  { value: 'hr', label: 'HR Organization' },
  { value: 'property', label: 'Property Organization' },
];

const HospitalAdminManagement = () => {
  const { data: admins = [], isLoading: adminsLoading } = useGetSuperAdminHospitalAdminsQuery();
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetSuperAdminHospitalsQuery();
  const { data: stocks = [], isLoading: stocksLoading } = useGetSuperAdminStocksQuery();
  const { data: pharmacies = [], isLoading: pharmaciesLoading } = useGetSuperAdminPharmaciesQuery();
  const { data: ngos = [], isLoading: ngosLoading } = useGetSuperAdminNGOsQuery();
  const { data: hrOrganizations = [], isLoading: hrLoading } = useGetSuperAdminHROrganizationsQuery();
  const { data: propertyOrganizations = [], isLoading: propertyLoading } = useGetSuperAdminPropertyOrganizationsQuery();
  const [createHospitalAdmin] = useCreateSuperAdminHospitalAdminMutation();
  const [updateHospitalAdminStatus] = useUpdateSuperAdminHospitalAdminStatusMutation();
  const [reassignHospitalAdmin] = useReassignSuperAdminHospitalAdminMutation();
  const [resetHospitalAdminPassword] = useResetSuperAdminHospitalAdminPasswordMutation();
  const [deleteHospitalAdmin] = useDeleteSuperAdminHospitalAdminMutation();

  const loading = adminsLoading || hospitalsLoading || stocksLoading || pharmaciesLoading || ngosLoading || hrLoading || propertyLoading;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [reassignHospitalId, setReassignHospitalId] = useState('');
  const [entityType, setEntityType] = useState('hospital');

  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    hospitalId: '',
    entityType: 'hospital'
  });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await createHospitalAdmin(newAdmin).unwrap();
      setShowCreateModal(false);
      setNewAdmin({ email: '', password: '', hospitalId: '', entityType: 'hospital' });
    } catch (error) {
      console.error('Error creating admin:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleStatusChange = async (adminId, newStatus) => {
    try {
      await updateHospitalAdminStatus({ id: adminId, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Error updating admin status:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleReassignHospital = async () => {
    if (!reassignHospitalId) return;
    const adminDocId = selectedAdmin.docId || selectedAdmin.id;
    if (!adminDocId || adminDocId === 'null') {
      alert('Cannot reassign: admin document ID is missing. Please delete and recreate this admin.');
      return;
    }
    try {
      await reassignHospitalAdmin({
        adminId: adminDocId,
        hospitalId: reassignHospitalId,
      }).unwrap();
      setShowReassignModal(false);
      setReassignHospitalId('');
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error reassigning hospital:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetHospitalAdminPassword({
        id: selectedAdmin.id,
        newPassword,
      }).unwrap();
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedAdmin(null);
      alert('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteHospitalAdmin(adminId).unwrap();
      } catch (error) {
        console.error('Error deleting admin:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  const entityLists = {
    hospital: hospitals,
    stock: stocks,
    pharmacy: pharmacies,
    ngo: ngos,
    hr: hrOrganizations,
    property: propertyOrganizations,
  };

  const getEntityLabel = (type) =>
    ENTITY_TYPES.find((e) => e.value === type)?.label || 'Entity';

  const getEntitiesForType = (type) =>
    (entityLists[type] || []).filter((e) => e.status !== 'deleted');

  const getEntityName = (entityId, entityType) => {
    const list = entityLists[entityType];
    if (list) {
      const entity = list.find((e) => e.id === entityId);
      return entity ? entity.name : null;
    }
    return null;
  };

  const getHospitalName = (hospitalId, adminEntityType) => {
    if (adminEntityType) {
      return getEntityName(hospitalId, adminEntityType) || 'Unknown Entity';
    }
    for (const type of ENTITY_TYPES.map((t) => t.value)) {
      const name = getEntityName(hospitalId, type);
      if (name) return name;
    }
    return 'Unknown Entity';
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
            <p className="text-gray-600 mt-1">Manage administrators across hospitals, stock, pharmacy, NGO, HR, and property</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>A</span>
            <span>Add Admin</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-gray-800">{admins.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">A</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Admins</p>
                <p className="text-3xl font-bold text-green-600">
                  {admins.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Inactive Admins</p>
                <p className="text-3xl font-bold text-red-600">
                  {admins.filter(a => a.status === 'inactive').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">X</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Administrators</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {admin.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.email}</div>
                          <div className="text-sm text-gray-500">Administrator</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getHospitalName(admin.hospitalId, admin.entityType)}</div>
                      {admin.entityType && (
                        <div className="text-xs text-gray-500">{getEntityLabel(admin.entityType)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLogin 
                        ? new Date(admin.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleStatusChange(
                          admin.id, 
                          admin.status === 'active' ? 'inactive' : 'active'
                        )}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          admin.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowPasswordModal(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium"
                      >
                        Reset Password
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setEntityType(admin.entityType || 'hospital');
                          setReassignHospitalId(admin.hospitalId || '');
                          setShowReassignModal(true);
                        }}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-medium"
                      >
                        Reassign
                      </button>
                      
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 font-bold text-blue-600">A</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No admins found</h3>
              <p className="text-gray-600">Create your first hospital admin to get started</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@entity.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter secure password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  required
                  value={newAdmin.entityType}
                  onChange={(e) => setNewAdmin({...newAdmin, entityType: e.target.value, hospitalId: ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ENTITY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select {getEntityLabel(newAdmin.entityType)}
                </label>
                <select
                  required
                  value={newAdmin.hospitalId}
                  onChange={(e) => setNewAdmin({...newAdmin, hospitalId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {getEntityLabel(newAdmin.entityType)}</option>
                  {getEntitiesForType(newAdmin.entityType).map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name} {entity.status && entity.status !== 'active' ? `(${entity.status})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewAdmin({ email: '', password: '', hospitalId: '', entityType: 'hospital' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReassignModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reassign Entity</h2>
            <p className="text-gray-600 mb-4">Admin: <strong>{selectedAdmin.email}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  value={entityType}
                  onChange={(e) => { setEntityType(e.target.value); setReassignHospitalId(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {ENTITY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select {getEntityLabel(entityType)}</label>
                <select
                  value={reassignHospitalId}
                  onChange={(e) => setReassignHospitalId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select {getEntityLabel(entityType)}</option>
                  {getEntitiesForType(entityType).map(entity => (
                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => { setShowReassignModal(false); setSelectedAdmin(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassignHospital}
                  disabled={!reassignHospitalId}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                >
                  Reassign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-4">Reset password for: {selectedAdmin.email}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedAdmin(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={!newPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default HospitalAdminManagement;