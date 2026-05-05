import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const HospitalAdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminsRes, hospitalsRes, stocksRes, pharmaciesRes] = await Promise.all([
        superAdminService.getAllHospitalAdmins(),
        superAdminService.getAllHospitals(),
        superAdminService.getAllStocks(),
        superAdminService.getAllPharmacies()
      ]);
      
      if (adminsRes.success) setAdmins(adminsRes.data);
      if (hospitalsRes.success) setHospitals(hospitalsRes.data);
      if (stocksRes.success) setStocks(stocksRes.data);
      if (pharmaciesRes.success) setPharmacies(pharmaciesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createHospitalAdmin(newAdmin);
      if (response.success) {
        setAdmins([...admins, response.data]);
        setShowCreateModal(false);
        setNewAdmin({ email: '', password: '', hospitalId: '', entityType: 'hospital' });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const handleStatusChange = async (adminId, newStatus) => {
    try {
      const response = await superAdminService.updateHospitalAdminStatus(adminId, newStatus);
      if (response.success) {
        setAdmins(admins.map(a => 
          a.id === adminId ? { ...a, status: newStatus } : a
        ));
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const handleReassignHospital = async () => {
    if (!reassignHospitalId) return;
    // Use docId which is guaranteed to be the real Firestore document ID
    const adminDocId = selectedAdmin.docId || selectedAdmin.id;
    if (!adminDocId || adminDocId === 'null') {
      alert('Cannot reassign: admin document ID is missing. Please delete and recreate this admin.');
      return;
    }
    try {
      const response = await superAdminService.reassignHospital(adminDocId, reassignHospitalId);
      if (response.success) {
        setAdmins(admins.map(a =>
          (a.docId || a.id) === adminDocId ? { ...a, hospitalId: reassignHospitalId } : a
        ));
        setShowReassignModal(false);
        setReassignHospitalId('');
        setSelectedAdmin(null);
      }
    } catch (error) {
      console.error('Error reassigning hospital:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await superAdminService.resetHospitalAdminPassword(selectedAdmin.id, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedAdmin(null);
      alert('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await superAdminService.deleteHospitalAdmin(adminId);
        setAdmins(admins.filter(a => a.id !== adminId));
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    const stock = stocks.find(s => s.id === hospitalId);
    const pharmacy = pharmacies.find(p => p.id === hospitalId);
    return hospital ? hospital.name : stock ? stock.name : pharmacy ? pharmacy.name : 'Unknown Entity';
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
            <p className="text-gray-600 mt-1">Manage hospital, stock, and pharmacy administrators</p>
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
                      <div className="text-sm text-gray-900">{getHospitalName(admin.hospitalId)}</div>
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
                  <option value="hospital">Hospital</option>
                  <option value="stock">Stock</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newAdmin.entityType === 'hospital' ? 'Hospital' : newAdmin.entityType === 'stock' ? 'Stock' : 'Pharmacy'}
                </label>
                <select
                  required
                  value={newAdmin.hospitalId}
                  onChange={(e) => setNewAdmin({...newAdmin, hospitalId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {newAdmin.entityType === 'hospital' ? 'Hospital' : newAdmin.entityType === 'stock' ? 'Stock' : 'Pharmacy'}</option>
                  {(newAdmin.entityType === 'hospital' ? hospitals : newAdmin.entityType === 'stock' ? stocks : pharmacies)
                    .filter(e => e.status !== 'deleted')
                    .map(entity => (
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
                  <option value="hospital">Hospital</option>
                  <option value="stock">Stock</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select {entityType === 'hospital' ? 'Hospital' : entityType === 'stock' ? 'Stock' : 'Pharmacy'}</label>
                <select
                  value={reassignHospitalId}
                  onChange={(e) => setReassignHospitalId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select {entityType === 'hospital' ? 'Hospital' : entityType === 'stock' ? 'Stock' : 'Pharmacy'}</option>
                  {(entityType === 'hospital' ? hospitals : entityType === 'stock' ? stocks : pharmacies)
                    .filter(e => e.status !== 'deleted')
                    .map(entity => (
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