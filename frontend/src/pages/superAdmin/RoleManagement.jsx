import React, { useMemo, useState } from 'react';
import { Shield, Plus, Trash2, Loader2, GitBranch, Lock } from 'lucide-react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminRolesQuery,
  useCreateSuperAdminRoleMutation,
  useDeleteSuperAdminRoleMutation,
  useAddSuperAdminSubRoleMutation,
  useRemoveSuperAdminSubRoleMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase';

export default function RoleManagement() {
  const { data: roles = [], isLoading, refetch } = useGetSuperAdminRolesQuery();
  const [createRole, { isLoading: creating }] = useCreateSuperAdminRoleMutation();
  const [deleteRole] = useDeleteSuperAdminRoleMutation();
  const [addSubRole, { isLoading: addingSubRole }] = useAddSuperAdminSubRoleMutation();
  const [removeSubRole] = useRemoveSuperAdminSubRoleMutation();

  const [roleName, setRoleName] = useState('');
  const [expandedRoleId, setExpandedRoleId] = useState('');
  const [subRoleName, setSubRoleName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sortedRoles = useMemo(
    () => [...roles].sort((a, b) => (a.role_name || '').localeCompare(b.role_name || '')),
    [roles],
  );

  const notify = (text, isError = false) => {
    if (isError) {
      setError(text);
      setMessage('');
    } else {
      setMessage(text);
      setError('');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 4000);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await createRole({ role_name: roleName }).unwrap();
      setRoleName('');
      notify('Role created successfully.');
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to create role.'), true);
    }
  };

  const handleDeleteRole = async (role) => {
    if (role.is_system) return;
    if (!window.confirm(`Delete role "${role.role_name}"?`)) return;
    try {
      await deleteRole(role.id).unwrap();
      notify('Role deleted.');
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to delete role.'), true);
    }
  };

  const handleAddSubRole = async (roleId) => {
    if (!subRoleName.trim()) return;
    try {
      await addSubRole({ roleId, name: subRoleName.trim() }).unwrap();
      setSubRoleName('');
      notify('Sub-role added.');
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to add sub-role.'), true);
    }
  };

  const handleRemoveSubRole = async (roleId, subRoleId) => {
    try {
      await removeSubRole({ roleId, subRoleId }).unwrap();
      notify('Sub-role removed.');
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to remove sub-role.'), true);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="text-gray-600 mt-1">
                Manage platform roles and sub-roles. SUPER_ADMIN is the system root role.
              </p>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {error || message}
          </div>
        )}

        <form onSubmit={handleCreateRole} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create role</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. PLATFORM_MANAGER"
              className={inputClass}
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create role
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Roles you create will record SUPER_ADMIN as created_by.
          </p>
        </form>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Roles ({sortedRoles.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading roles...
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedRoles.map((role) => (
                <div key={role.id} className="px-6 py-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">{role.role_name}</h3>
                        {role.is_system && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            <Lock className="h-3 w-3" />
                            System
                          </span>
                        )}
                      </div>
                      {role.created_by && (
                        <p className="text-sm text-gray-500 mt-1">
                          Created by {role.created_by.role_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 font-mono">ID: {role.id}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRoleId(expandedRoleId === role.id ? '' : role.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <GitBranch className="h-4 w-4" />
                        Sub-roles ({role.sub_roles?.length || 0})
                      </button>
                      {!role.is_system && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedRoleId === role.id && (
                    <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-900 mb-3">Roles</p>
                      {(role.sub_roles || []).length === 0 ? (
                        <p className="text-sm text-gray-500 mb-3">No roles yet.</p>
                      ) : (
                        <ul className="space-y-2 mb-4">
                          {role.sub_roles.map((subRole) => (
                            <li
                              key={subRole.id}
                              className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm"
                            >
                              <span>
                                <span className="font-medium text-gray-900">{subRole.name}</span>
                                <span className="text-gray-400 ml-2 text-xs font-mono">{subRole.id}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubRole(role.id, subRole.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-medium"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={expandedRoleId === role.id ? subRoleName : ''}
                          onChange={(e) => setSubRoleName(e.target.value)}
                          placeholder="Role name"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          disabled={addingSubRole}
                          onClick={() => handleAddSubRole(role.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          {addingSubRole ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Add role
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
