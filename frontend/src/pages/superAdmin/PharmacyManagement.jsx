import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const PharmacyManagement = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const [newPharmacy, setNewPharmacy] = useState({
    name: '',
    location: '',
    contactInfo: { phone: '', email: '' },
    subscriptionPlan: 'basic',
    featuresEnabled: []
  });

  const availableFeatures = [
    'prescriptions', 'quotes', 'orders', 'doctors', 'branding', 'payments', 'callcenter', 'inventory'
  ];

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
    { value: 'premium', label: 'Premium', color: 'bg-blue-100 text-blue-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await superAdminService.getAllPharmacies();
      if (response.success) {
        setPharmacies(response.data);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePharmacy = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createPharmacy(newPharmacy);
      if (response.success) {
        setPharmacies([...pharmacies, response.data]);
        setShowCreateModal(false);
        setNewPharmacy({
          name: '',
          location: '',
          contactInfo: { phone: '', email: '' },
          subscriptionPlan: 'basic',
          featuresEnabled: []
        });
      }
    } catch (error) {
      console.error('Error creating pharmacy:', error);
    }
  };

  const handleStatusChange = async (pharmacyId, newStatus) => {
    try {
      const response = await superAdminService.updatePharmacyStatus(pharmacyId, newStatus);
      if (response.success) {
        setPharmacies(pharmacies.map(p => 
          p.id === pharmacyId ? { ...p, status: newStatus } : p
        ));
      }
    } catch (error) {
      console.error('Error updating pharmacy status:', error);
    }
  };

  const handleUpdateFeatures = async (pharmacyId, features) => {
    try {
      const response = await superAdminService.updatePharmacyFeatures(pharmacyId, features);
      if (response.success) {
        setPharmacies(pharmacies.map(p => 
          p.id === pharmacyId ? { ...p, featuresEnabled: features } : p
        ));
        setShowFeaturesModal(false);
      }
    } catch (error) {
      console.error('Error updating pharmacy features:', error);
    }
  };

  const handleSoftDelete = async (pharmacyId) => {
    if (window.confirm('Are you sure you want to soft delete this pharmacy? It can be recovered later.')) {
      try {
        await superAdminService.softDeletePharmacy(pharmacyId);
        fetchPharmacies();
      } catch (error) {
        console.error('Error soft deleting pharmacy:', error);
      }
    }
  };

  const handleHardDelete = async (pharmacyId) => {
    if (window.confirm('Are you sure you want to permanently delete this pharmacy? This action cannot be undone.')) {
      try {
        await superAdminService.hardDeletePharmacy(pharmacyId);
        setPharmacies(pharmacies.filter(p => p.id !== pharmacyId));
      } catch (error) {
        console.error('Error hard deleting pharmacy:', error);
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
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy Management</h1>
            <p className="text-gray-600 mt-1">Manage all pharmacy entities in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Pharmacy</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{pharmacy.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pharmacy.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pharmacy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pharmacy.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-sm font-medium">{pharmacy.contactInfo?.email}</p>
                    <p className="text-sm font-medium">{pharmacy.contactInfo?.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Subscription:</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      subscriptionPlans.find(p => p.value === pharmacy.subscriptionPlan)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {pharmacy.subscriptionPlan}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features ({pharmacy.featuresEnabled?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {pharmacy.featuresEnabled?.slice(0, 3).map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {pharmacy.featuresEnabled?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{pharmacy.featuresEnabled.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(
                      pharmacy.id, 
                      pharmacy.status === 'active' ? 'suspended' : 'active'
                    )}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      pharmacy.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {pharmacy.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedPharmacy(pharmacy);
                      setShowFeaturesModal(true);
                    }}
                    className="px-3 py-1 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded text-xs font-medium"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => handleSoftDelete(pharmacy.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-medium"
                  >
                    Soft Delete
                  </button>
                  
                  <button
                    onClick={() => handleHardDelete(pharmacy.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pharmacies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 font-bold text-teal-600">P</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No pharmacies found</h3>
            <p className="text-gray-600">Create your first pharmacy entity to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Pharmacy</h2>
            <form onSubmit={handleCreatePharmacy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                <input
                  type="text"
                  required
                  value={newPharmacy.name}
                  onChange={(e) => setNewPharmacy({...newPharmacy, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newPharmacy.location}
                  onChange={(e) => setNewPharmacy({...newPharmacy, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newPharmacy.contactInfo.email}
                  onChange={(e) => setNewPharmacy({
                    ...newPharmacy, 
                    contactInfo: {...newPharmacy.contactInfo, email: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newPharmacy.contactInfo.phone}
                  onChange={(e) => setNewPharmacy({
                    ...newPharmacy, 
                    contactInfo: {...newPharmacy.contactInfo, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newPharmacy.subscriptionPlan}
                  onChange={(e) => setNewPharmacy({...newPharmacy, subscriptionPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Create Pharmacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Features</h2>
            <p className="text-gray-600 mb-4">{selectedPharmacy.name}</p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableFeatures.map((feature) => (
                <label key={feature} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedPharmacy.featuresEnabled?.includes(feature) || false}
                    onChange={(e) => {
                      const updatedFeatures = e.target.checked
                        ? [...(selectedPharmacy.featuresEnabled || []), feature]
                        : (selectedPharmacy.featuresEnabled || []).filter(f => f !== feature);
                      setSelectedPharmacy({...selectedPharmacy, featuresEnabled: updatedFeatures});
                    }}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
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
                onClick={() => handleUpdateFeatures(selectedPharmacy.id, selectedPharmacy.featuresEnabled)}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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

export default PharmacyManagement;
