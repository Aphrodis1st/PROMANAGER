import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const HRManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const [newOrg, setNewOrg] = useState({
    name: '',
    location: '',
    contactInfo: { phone: '', email: '' },
    subscriptionPlan: 'basic',
    featuresEnabled: []
  });

  const availableFeatures = [
    'employees', 'departments', 'attendance', 'leave', 'payroll',
    'contracts', 'shifts', 'payslips', 'performance', 'documents', 'recruitment', 'reports'
  ];

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
    { value: 'premium', label: 'Premium', color: 'bg-blue-100 text-blue-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await superAdminService.getAllHROrganizations();
      if (response.success) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error('Error fetching HR organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createHROrganization(newOrg);
      if (response.success) {
        setOrganizations([...organizations, response.data]);
        setShowCreateModal(false);
        setNewOrg({
          name: '',
          location: '',
          contactInfo: { phone: '', email: '' },
          subscriptionPlan: 'basic',
          featuresEnabled: []
        });
      }
    } catch (error) {
      console.error('Error creating HR organization:', error);
    }
  };

  const handleStatusChange = async (orgId, newStatus) => {
    try {
      const response = await superAdminService.updateHROrganizationStatus(orgId, newStatus);
      if (response.success) {
        setOrganizations(organizations.map(o => 
          o.id === orgId ? { ...o, status: newStatus } : o
        ));
      }
    } catch (error) {
      console.error('Error updating organization status:', error);
    }
  };

  const handleUpdateFeatures = async (orgId, features) => {
    try {
      const response = await superAdminService.updateHROrganizationFeatures(orgId, features);
      if (response.success) {
        setOrganizations(organizations.map(o => 
          o.id === orgId ? { ...o, featuresEnabled: features } : o
        ));
        setShowFeaturesModal(false);
      }
    } catch (error) {
      console.error('Error updating organization features:', error);
    }
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this HR organization?')) {
      try {
        await superAdminService.deleteHROrganization(orgId);
        setOrganizations(organizations.filter(o => o.id !== orgId));
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-800">HR Management</h1>
            <p className="text-gray-600 mt-1">Manage all HR organizations in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add HR Organization</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div key={org.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{org.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {org.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-sm font-medium">{org.contactInfo?.email}</p>
                    <p className="text-sm font-medium">{org.contactInfo?.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Subscription:</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      subscriptionPlans.find(p => p.value === org.subscriptionPlan)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {org.subscriptionPlan}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features ({org.featuresEnabled?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {org.featuresEnabled?.slice(0, 3).map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {org.featuresEnabled?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{org.featuresEnabled.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(
                      org.id, 
                      org.status === 'active' ? 'suspended' : 'active'
                    )}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      org.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {org.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setShowFeaturesModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {organizations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 font-bold text-blue-600">HR</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No HR organizations found</h3>
            <p className="text-gray-600">Create your first HR organization to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New HR Organization</h2>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newOrg.location}
                  onChange={(e) => setNewOrg({...newOrg, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newOrg.contactInfo.email}
                  onChange={(e) => setNewOrg({
                    ...newOrg, 
                    contactInfo: {...newOrg.contactInfo, email: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newOrg.contactInfo.phone}
                  onChange={(e) => setNewOrg({
                    ...newOrg, 
                    contactInfo: {...newOrg.contactInfo, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newOrg.subscriptionPlan}
                  onChange={(e) => setNewOrg({...newOrg, subscriptionPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subscriptionPlans.map(plan => (
                    <option key={plan.value} value={plan.value}>{plan.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Features</h2>
            <p className="text-gray-600 mb-4">{selectedOrg.name}</p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableFeatures.map((feature) => (
                <label key={feature} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedOrg.featuresEnabled?.includes(feature) || false}
                    onChange={(e) => {
                      const updatedFeatures = e.target.checked
                        ? [...(selectedOrg.featuresEnabled || []), feature]
                        : (selectedOrg.featuresEnabled || []).filter(f => f !== feature);
                      setSelectedOrg({...selectedOrg, featuresEnabled: updatedFeatures});
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateFeatures(selectedOrg.id, selectedOrg.featuresEnabled)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Features
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default HRManagement;
