import React, { useState } from 'react';
import { Settings, Lock, Unlock, Plus, Trash2, Edit3, Save, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function NGOSettingsController({ workspace, updateWorkspace }) {
  const [editingFeature, setEditingFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({});

  const features = [
    { id: 'organizations', label: 'Organizations', description: 'Multi-NGO/Church management', count: workspace.organizations?.length || 0, restricted: false },
    { id: 'branches', label: 'Branches', description: 'Headquarters, regional offices, church branches', count: workspace.branches?.length || 0, restricted: false },
    { id: 'departments', label: 'Departments', description: 'Department structure and budgets', count: workspace.departments?.length || 0, restricted: false },
    { id: 'staff', label: 'Staff', description: 'Staff organizational chart', count: workspace.staff?.length || 0, restricted: false },
    { id: 'roles', label: 'Roles', description: 'User roles and permissions', count: workspace.roles?.length || 0, restricted: false },
    { id: 'grants', label: 'Grants', description: 'Grant management and compliance', count: workspace.grants?.length || 0, restricted: false },
    { id: 'payrollRuns', label: 'Payroll', description: 'Payroll processing and approvals', count: workspace.payrollRuns?.length || 0, restricted: false },
    { id: 'donorReports', label: 'Donor Reports', description: 'Financial donor reporting', count: workspace.donorReports?.length || 0, restricted: false },
    { id: 'chartOfAccounts', label: 'Chart of Accounts', description: 'GL account structure', count: workspace.chartOfAccounts?.length || 0, restricted: false },
    { id: 'bankAccounts', label: 'Bank Accounts', description: 'Bank and cash accounts', count: workspace.bankAccounts?.length || 0, restricted: false },
    { id: 'payments', label: 'Payments', description: 'Payment vouchers', count: workspace.payments?.length || 0, restricted: false },
    { id: 'journalEntries', label: 'Journal Entries', description: 'Double-entry accounting', count: workspace.journalEntries?.length || 0, restricted: false },
    { id: 'beneficialOwners', label: 'Beneficial Owners', description: 'KYC, governance control, and transparency register', count: workspace.beneficialOwners?.length || 0, restricted: false },
    { id: 'projects', label: 'Projects', description: 'Program and project portfolio models', count: workspace.projects?.length || 0, restricted: false },
    { id: 'tenders', label: 'Tenders', description: 'Procurement tenders and evaluation methods', count: workspace.tenders?.length || 0, restricted: false },
    { id: 'contracts', label: 'Contracts', description: 'Professional contract register', count: workspace.contracts?.length || 0, restricted: false },
    { id: 'storages', label: 'Storages', description: 'Physical and digital document repositories', count: workspace.storages?.length || 0, restricted: false },
    { id: 'impacts', label: 'Impacts', description: 'Outcome indicators and verified results', count: workspace.impacts?.length || 0, restricted: false },
    { id: 'evaluations', label: 'Evaluations', description: 'Baseline, midline, final, and learning reviews', count: workspace.evaluations?.length || 0, restricted: false },
    { id: 'fieldSites', label: 'Field Sites', description: 'GIS project locations', count: workspace.fieldSites?.length || 0, restricted: false },
    { id: 'fieldVisits', label: 'Field Visits', description: 'Field visit tracking', count: workspace.fieldVisits?.length || 0, restricted: false },
    { id: 'serviceControls', label: 'Service Controls', description: 'Multi-service management', count: workspace.serviceControls?.length || 0, restricted: false },
    { id: 'languages', label: 'Languages', description: 'Multi-language support', count: workspace.languages?.length || 0, restricted: false },
    { id: 'currencies', label: 'Currencies', description: 'Multi-currency support', count: workspace.currencies?.length || 0, restricted: false }
  ];

  const toggleRestriction = (featureId) => {
    updateWorkspace(
      current => ({
        ...current,
        featureRestrictions: {
          ...(current.featureRestrictions || {}),
          [featureId]: !(current.featureRestrictions?.[featureId] || false)
        }
      }),
      `Feature ${featureId} restriction toggled`
    );
  };

  const clearFeature = (featureId) => {
    if (!window.confirm(`Clear all ${featureId} data? This cannot be undone.`)) return;
    updateWorkspace(
      current => ({ ...current, [featureId]: [] }),
      `Feature ${featureId} cleared`
    );
  };

  const resetFeature = (featureId) => {
    if (!window.confirm(`Reset ${featureId} to default? This cannot be undone.`)) return;
    const defaults = {
      organizations: [],
      branches: [],
      departments: [],
      staff: [],
      roles: [],
      grants: [],
      payrollRuns: [],
      donorReports: [],
      chartOfAccounts: [],
      bankAccounts: [],
      payments: [],
      journalEntries: [],
      beneficialOwners: [],
      projects: [],
      tenders: [],
      contracts: [],
      storages: [],
      impacts: [],
      evaluations: [],
      fieldSites: [],
      fieldVisits: [],
      serviceControls: [],
      languages: ['English'],
      currencies: ['USD']
    };
    updateWorkspace(
      current => ({ ...current, [featureId]: defaults[featureId] || [] }),
      `Feature ${featureId} reset to default`
    );
  };

  const isRestricted = (featureId) => workspace.featureRestrictions?.[featureId] || false;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900">Settings Controller</h4>
            <p className="text-sm text-amber-800 mt-1">
              This is the master controller for all NGO features. Use this to allow, restrict, add, remove, clear, or reset any feature across the entire system.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {features.map(feature => {
          const restricted = isRestricted(feature.id);
          return (
            <div key={feature.id} className={`rounded-lg border p-4 ${restricted ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{feature.label}</h4>
                    {restricted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        <Lock className="w-3 h-3" />
                        Restricted
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                      {feature.count} records
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRestriction(feature.id)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                      restricted
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {restricted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {restricted ? 'Allow' : 'Restrict'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingFeature(feature.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modify
                  </button>

                  <button
                    type="button"
                    onClick={() => clearFeature(feature.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() => resetFeature(feature.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <Settings className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {restricted && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-800">
                    This feature is restricted. Users cannot add, modify, or remove records until you allow it.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="font-bold mb-3">System Controls</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Features:</span>
              <span className="font-semibold">{features.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Restricted:</span>
              <span className="font-semibold text-red-700">{features.filter(f => isRestricted(f.id)).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Allowed:</span>
              <span className="font-semibold text-emerald-700">{features.filter(f => !isRestricted(f.id)).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Records:</span>
              <span className="font-semibold">{features.reduce((sum, f) => sum + f.count, 0)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="font-bold mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Allow all features? This will remove all restrictions.')) return;
                updateWorkspace(
                  current => ({ ...current, featureRestrictions: {} }),
                  'All features allowed'
                );
              }}
              className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Allow All Features
            </button>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Restrict all features? This will prevent all modifications.')) return;
                const restrictions = {};
                features.forEach(f => { restrictions[f.id] = true; });
                updateWorkspace(
                  current => ({ ...current, featureRestrictions: restrictions }),
                  'All features restricted'
                );
              }}
              className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Restrict All Features
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="font-bold text-emerald-900 mb-3">Professional Controls</h4>
          <div className="space-y-2 text-sm text-emerald-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Allow/Restrict any feature</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Modify feature settings</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Clear all feature data</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Reset to defaults</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
