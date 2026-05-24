import React, { useMemo, useState } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminNGOsQuery,
  useCreateSuperAdminNGOMutation,
  useUpdateSuperAdminNGOStatusMutation,
  useUpdateSuperAdminNGOFeaturesMutation,
  useSoftDeleteSuperAdminNGOMutation,
  useDeleteSuperAdminNGOMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';

const availableFeatures = [
  { id: 'organization_branch_management', name: 'Organization & Branch Management', category: 'Organization' },
  { id: 'multi_ngo_management', name: 'Multi-NGO Management', category: 'Organization' },
  { id: 'departments_hierarchy', name: 'Departments, Hierarchy & Org Chart', category: 'Organization' },
  { id: 'roles_permissions', name: 'User Roles & Permissions', category: 'Organization' },
  { id: 'multi_language_currency', name: 'Multi-Language & Multi-Currency', category: 'Organization' },
  { id: 'project_program_management', name: 'Project & Program Management', category: 'Programs' },
  { id: 'gantt_milestones_risks', name: 'Gantt, Milestones & Risk Management', category: 'Programs' },
  { id: 'impact_closure_reports', name: 'Impact Measurement & Closure Reports', category: 'Programs' },
  { id: 'donor_crm', name: 'Donor CRM', category: 'Donors' },
  { id: 'pledges_recurring_campaigns', name: 'Pledges, Recurring Donations & Campaigns', category: 'Donors' },
  { id: 'email_sms_notifications', name: 'Email & SMS Notifications', category: 'Donors' },
  { id: 'beneficiary_management', name: 'Beneficiary Management', category: 'Beneficiaries' },
  { id: 'household_support_tracking', name: 'Households, Vulnerability & Support Tracking', category: 'Beneficiaries' },
  { id: 'qr_biometric_documents', name: 'QR Cards, Biometrics & Documents', category: 'Beneficiaries' },
  { id: 'volunteer_management', name: 'Volunteer Management', category: 'People' },
  { id: 'church_management', name: 'Church Management', category: 'Church' },
  { id: 'church_finance', name: 'Tithes, Offerings, Pledges & Funds', category: 'Church' },
  { id: 'pastoral_management', name: 'Pastoral Management', category: 'Church' },
  { id: 'financial_management', name: 'Financial Management', category: 'Finance' },
  { id: 'procurement_approval_workflows', name: 'Procurement & Approval Workflows', category: 'Finance' },
  { id: 'financial_reports_audit', name: 'Financial Reports & Audit Trails', category: 'Finance' },
  { id: 'grant_management', name: 'Grant Management', category: 'Grants' },
  { id: 'monitoring_evaluation', name: 'Monitoring & Evaluation', category: 'M&E' },
  { id: 'events_campaigns', name: 'Events & Campaign Management', category: 'Engagement' },
  { id: 'asset_management', name: 'Asset Management', category: 'Operations' },
  { id: 'hr_payroll', name: 'Human Resource & Payroll', category: 'People' },
  { id: 'inventory_procurement', name: 'Inventory & Procurement', category: 'Operations' },
  { id: 'communication_center', name: 'Communication Center', category: 'Engagement' },
  { id: 'gis_field_operations', name: 'GIS & Field Operations', category: 'Operations' },
  { id: 'reports_analytics_dashboard', name: 'Reports & Analytics Dashboard', category: 'Analytics' }
];

const subscriptionPlans = [
  { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
  { value: 'premium', label: 'Premium', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
];

const blankNGO = {
  name: '',
  location: '',
  contactInfo: { phone: '', email: '' },
  subscriptionPlan: 'basic',
  organizationType: 'ngo',
  branchCount: 0,
  languages: ['English'],
  currencies: ['USD'],
  featuresEnabled: []
};

export default function NGOManagement() {
  const { data: ngos = [], isLoading: loading } = useGetSuperAdminNGOsQuery();
  const [createNGO] = useCreateSuperAdminNGOMutation();
  const [updateNGOStatus] = useUpdateSuperAdminNGOStatusMutation();
  const [updateNGOFeatures] = useUpdateSuperAdminNGOFeaturesMutation();
  const [softDeleteNGO] = useSoftDeleteSuperAdminNGOMutation();
  const [deleteNGO] = useDeleteSuperAdminNGOMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNGO, setNewNGO] = useState(blankNGO);

  const featureCategories = useMemo(
    () => [...new Set(availableFeatures.map(feature => feature.category))],
    []
  );

  const handleCreateNGO = async (e) => {
    e.preventDefault();
    try {
      await createNGO(newNGO).unwrap();
      setShowCreateModal(false);
      setNewNGO(blankNGO);
    } catch (error) {
      console.error('Error creating NGO:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleStatusChange = async (ngoId, status) => {
    try {
      await updateNGOStatus({ id: ngoId, status }).unwrap();
    } catch (error) {
      console.error('Error updating NGO status:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleUpdateFeatures = async (ngoId, features) => {
    try {
      await updateNGOFeatures({ id: ngoId, features }).unwrap();
      setShowFeaturesModal(false);
    } catch (error) {
      console.error('Error updating NGO features:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleSoftDelete = async (ngoId) => {
    if (window.confirm('Are you sure you want to soft delete this NGO? It can be recovered later.')) {
      try {
        await softDeleteNGO(ngoId).unwrap();
      } catch (error) {
        console.error('Error soft deleting NGO:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  const handleHardDelete = async (ngoId) => {
    if (window.confirm('Are you sure you want to permanently delete this NGO? This action cannot be undone.')) {
      try {
        await deleteNGO(ngoId).unwrap();
      } catch (error) {
        console.error('Error hard deleting NGO:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  const filteredNGOs = ngos.filter((ngo) => {
    const search = searchTerm.toLowerCase();
    return (
      ngo.name?.toLowerCase().includes(search) ||
      ngo.location?.toLowerCase().includes(search) ||
      ngo.contactInfo?.email?.toLowerCase().includes(search) ||
      ngo.organizationType?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">NGO Management</h1>
            <p className="text-gray-600 mt-1">Manage NGO, church, donor, program, grant, finance, and field-service tenants ({ngos.length} total)</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add NGO</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <input
            type="text"
            placeholder="Search NGOs by name, location, email, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNGOs.map((ngo) => (
            <div key={ngo.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{ngo.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{ngo.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ngo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ngo.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-sm font-medium">{ngo.contactInfo?.email}</p>
                    <p className="text-sm font-medium">{ngo.contactInfo?.phone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Type:</p>
                      <p className="font-medium capitalize">{ngo.organizationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Branches:</p>
                      <p className="font-medium">{ngo.branchCount || 0}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subscription:</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      subscriptionPlans.find(plan => plan.value === ngo.subscriptionPlan)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {ngo.subscriptionPlan}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features ({ngo.featuresEnabled?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {ngo.featuresEnabled?.slice(0, 3).map((featureId) => {
                        const feature = availableFeatures.find(item => item.id === featureId);
                        return (
                          <span key={featureId} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded">
                            {feature?.name || featureId}
                          </span>
                        );
                      })}
                      {ngo.featuresEnabled?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{ngo.featuresEnabled.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(ngo.id, ngo.status === 'active' ? 'suspended' : 'active')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      ngo.status === 'active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {ngo.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNGO(ngo);
                      setShowFeaturesModal(true);
                    }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded text-xs font-medium"
                  >
                    Features
                  </button>
                  <button onClick={() => handleSoftDelete(ngo.id)} className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-medium">
                    Soft Delete
                  </button>
                  <button onClick={() => handleHardDelete(ngo.id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNGOs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 font-bold text-emerald-600">N</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">{searchTerm ? 'No NGOs match your search' : 'No NGOs found'}</h3>
            <p className="text-gray-600">{searchTerm ? 'Try adjusting your search terms' : 'Create your first NGO tenant to get started'}</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New NGO</h2>
            <form onSubmit={handleCreateNGO} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NGO / Church Name</label>
                <input type="text" required value={newNGO.name} onChange={(e) => setNewNGO({ ...newNGO, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters / Main Location</label>
                <input type="text" required value={newNGO.location} onChange={(e) => setNewNGO({ ...newNGO, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={newNGO.contactInfo.email} onChange={(e) => setNewNGO({ ...newNGO, contactInfo: { ...newNGO.contactInfo, email: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" required value={newNGO.contactInfo.phone} onChange={(e) => setNewNGO({ ...newNGO, contactInfo: { ...newNGO.contactInfo, phone: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                  <select value={newNGO.organizationType} onChange={(e) => setNewNGO({ ...newNGO, organizationType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option value="ngo">NGO</option>
                    <option value="church">Church</option>
                    <option value="faith_based_ngo">Faith-Based NGO</option>
                    <option value="humanitarian">Humanitarian Organization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Count</label>
                  <input type="number" min="0" value={newNGO.branchCount} onChange={(e) => setNewNGO({ ...newNGO, branchCount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select value={newNGO.subscriptionPlan} onChange={(e) => setNewNGO({ ...newNGO, subscriptionPlan: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  {subscriptionPlans.map(plan => <option key={plan.value} value={plan.value}>{plan.label}</option>)}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Create NGO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage NGO Features</h2>
                <p className="text-gray-600 mt-1">{selectedNGO.name}</p>
              </div>
              <button onClick={() => setShowFeaturesModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">x</button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{selectedNGO.featuresEnabled?.length || 0} of {availableFeatures.length} features enabled</p>
              <div className="flex gap-2">
                <button onClick={() => setSelectedNGO({ ...selectedNGO, featuresEnabled: availableFeatures.map(f => f.id) })} className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100">
                  Select All
                </button>
                <button onClick={() => setSelectedNGO({ ...selectedNGO, featuresEnabled: [] })} className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {featureCategories.map(category => (
                <div key={category} className="mb-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2 px-2 py-1 bg-gray-100 rounded">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableFeatures.filter(feature => feature.category === category).map(feature => (
                      <label key={feature.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedNGO.featuresEnabled?.includes(feature.id) || false}
                          onChange={(e) => {
                            const updatedFeatures = e.target.checked
                              ? [...(selectedNGO.featuresEnabled || []), feature.id]
                              : (selectedNGO.featuresEnabled || []).filter(id => id !== feature.id);
                            setSelectedNGO({ ...selectedNGO, featuresEnabled: updatedFeatures });
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 pt-4 border-t mt-4">
              <button onClick={() => setShowFeaturesModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleUpdateFeatures(selectedNGO.id, selectedNGO.featuresEnabled)} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Update Features
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
