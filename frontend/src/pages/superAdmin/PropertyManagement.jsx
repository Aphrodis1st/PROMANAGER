import React, { useState } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminPropertyOrganizationsQuery,
  useCreateSuperAdminPropertyOrganizationMutation,
  useUpdateSuperAdminPropertyOrganizationStatusMutation,
  useUpdateSuperAdminPropertyOrganizationFeaturesMutation,
  useSoftDeleteSuperAdminPropertyOrganizationMutation,
  useDeleteSuperAdminPropertyOrganizationMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';

const PropertyManagement = () => {
  const { data: organizations = [], isLoading: loading } = useGetSuperAdminPropertyOrganizationsQuery();
  const [createPropertyOrg] = useCreateSuperAdminPropertyOrganizationMutation();
  const [updatePropertyStatus] = useUpdateSuperAdminPropertyOrganizationStatusMutation();
  const [updatePropertyFeatures] = useUpdateSuperAdminPropertyOrganizationFeaturesMutation();
  const [deletePropertyOrg] = useDeleteSuperAdminPropertyOrganizationMutation();
  const [softDeletePropertyOrg] = useSoftDeleteSuperAdminPropertyOrganizationMutation();
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
    { id: 'properties', name: 'Property Portfolio', category: 'Core' },
    { id: 'units', name: 'Unit Management', category: 'Core' },
    { id: 'tenants', name: 'Tenant Management', category: 'Core' },
    { id: 'leases', name: 'Lease Management', category: 'Core' },
    { id: 'billing', name: 'Billing & Invoicing', category: 'Finance' },
    { id: 'rent_collection', name: 'Rent Collection', category: 'Finance' },
    { id: 'maintenance', name: 'Maintenance Requests', category: 'Operations' },
    { id: 'staff', name: 'Property Staff', category: 'Operations' },
    { id: 'reports', name: 'Reports & Analytics', category: 'Analytics' },
    { id: 'communication', name: 'Communication Center', category: 'Engagement' },
    { id: 'owner_portal', name: 'Owner Portal', category: 'Portals' },
    { id: 'tenant_portal', name: 'Tenant Portal', category: 'Portals' },
  ];

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
    { value: 'premium', label: 'Premium', color: 'bg-amber-100 text-amber-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      await createPropertyOrg(newOrg).unwrap();
      setShowCreateModal(false);
      setNewOrg({
        name: '',
        location: '',
        contactInfo: { phone: '', email: '' },
        subscriptionPlan: 'basic',
        featuresEnabled: []
      });
    } catch (error) {
      console.error('Error creating property organization:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleStatusChange = async (orgId, newStatus) => {
    try {
      await updatePropertyStatus({ id: orgId, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Error updating organization status:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleUpdateFeatures = async (orgId, features) => {
    try {
      await updatePropertyFeatures({ id: orgId, features }).unwrap();
      setShowFeaturesModal(false);
    } catch (error) {
      console.error('Error updating organization features:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this property organization?')) {
      try {
        await deletePropertyOrg(orgId).unwrap();
      } catch (error) {
        console.error('Error deleting organization:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Property Management</h1>
            <p className="text-gray-600 mt-1">Manage all property organizations in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Property Organization</span>
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
                      {org.featuresEnabled?.slice(0, 3).map((featureId) => {
                        const feature = availableFeatures.find(f => f.id === featureId);
                        return (
                          <span key={featureId} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded">
                            {feature?.name || featureId}
                          </span>
                        );
                      })}
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
                    className="px-3 py-1 bg-blue-100 text-amber-700 hover:bg-amber-200 rounded text-xs font-medium"
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
            <div className="text-6xl mb-4 font-bold text-amber-600">P</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No property organizations found</h3>
            <p className="text-gray-600">Create your first property organization to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Property Organization</h2>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newOrg.location}
                  onChange={(e) => setNewOrg({...newOrg, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newOrg.subscriptionPlan}
                  onChange={(e) => setNewOrg({...newOrg, subscriptionPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Features</h2>
                <p className="text-gray-600 mt-1">{selectedOrg.name}</p>
              </div>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedOrg.featuresEnabled?.length || 0} of {availableFeatures.length} features enabled
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrg({
                    ...selectedOrg,
                    featuresEnabled: availableFeatures.map(f => f.id)
                  })}
                  className="px-3 py-1 text-xs bg-amber-50 text-amber-600 rounded hover:bg-amber-100"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedOrg({
                    ...selectedOrg,
                    featuresEnabled: []
                  })}
                  className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {['Core', 'Finance', 'Operations', 'Analytics', 'Engagement', 'Portals'].map(category => {
                const categoryFeatures = availableFeatures.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;
                
                return (
                  <div key={category} className="mb-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2 px-2 py-1 bg-gray-100 rounded">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedOrg.featuresEnabled?.includes(feature.id) || false}
                            onChange={(e) => {
                              const updatedFeatures = e.target.checked
                                ? [...(selectedOrg.featuresEnabled || []), feature.id]
                                : (selectedOrg.featuresEnabled || []).filter(f => f !== feature.id);
                              setSelectedOrg({...selectedOrg, featuresEnabled: updatedFeatures});
                            }}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {feature.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex space-x-3 pt-4 border-t mt-4">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateFeatures(selectedOrg.id, selectedOrg.featuresEnabled)}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
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

export default PropertyManagement;
