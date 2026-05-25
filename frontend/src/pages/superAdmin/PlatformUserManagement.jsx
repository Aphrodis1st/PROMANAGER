import React, { useMemo, useState } from 'react';
import { Users, Plus, Trash2, Loader2, Edit, Shield, Building2 } from 'lucide-react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminPlatformUsersQuery,
  useGetSuperAdminRolesQuery,
  useCreateSuperAdminPlatformUserMutation,
  useUpdateSuperAdminPlatformUserMutation,
  useDeleteSuperAdminPlatformUserMutation,
  useUpdateSuperAdminServiceRegistrationMutation,
  useDeleteSuperAdminServiceRegistrationMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';
import {
  rolesForServiceRegistration,
  getServiceAdminRoles,
} from '../../config/serviceUserRoles.js';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

const selectClass =
  'w-full min-w-[140px] rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60';

function InlineRoleAssign({
  user,
  roles,
  saving,
  disabled,
  disabledReason,
  onRoleChange,
  onSubRoleToggle,
}) {
  const roleId = user.role?.role_id || '';
  const subRoleIds = (user.role?.sub_roles || []).map((sr) => sr.id);
  const selectedRole = roles.find((r) => r.id === roleId);
  const isDisabled = disabled || saving;

  return (
    <div className="space-y-2 min-w-[180px]">
      {disabled && disabledReason && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1">
          {disabledReason}
        </p>
      )}
      <select
        value={roleId}
        onChange={(e) => onRoleChange(user, e.target.value)}
        disabled={isDisabled}
        className={selectClass}
        aria-label={`Assign role for ${user.name}`}
      >
        <option value="">Select role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role_name}
          </option>
        ))}
      </select>
      {!isDisabled && roles.length === 0 && (
        <p className="text-xs text-red-600">
          No roles available. Create service roles (e.g. HOSPITAL_ADMIN, STOCK_ADMIN, NGO_ADMIN)
          under Role Management.
        </p>
      )}
      {selectedRole?.sub_roles?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedRole.sub_roles.map((subRole) => {
            const selected = subRoleIds.includes(subRole.id);
            return (
              <button
                key={subRole.id}
                type="button"
                disabled={isDisabled || !roleId}
                onClick={() => onSubRoleToggle(user, subRole.id)}
                className={`rounded-full px-2 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60 ${
                  selected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
                }`}
              >
                {subRole.name}
              </button>
            );
          })}
        </div>
      )}
      {saving && (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </span>
      )}
    </div>
  );
}

const EMPTY_PLATFORM_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  roleId: '',
  subRoleIds: [],
};

const EMPTY_SERVICE_FORM = {
  organizationName: '',
  description: '',
  registrantName: '',
  registrantEmail: '',
  registrantPhone: '',
  is_manager: true,
  managerName: '',
  managerEmail: '',
  managerPhone: '',
};

function isServiceRegistration(user) {
  return user?.source === 'service_registration';
}

function getUserStatus(user) {
  if (isServiceRegistration(user)) {
    return user?.status || 'inactive';
  }
  return user?.status || 'active';
}

function isUserActive(user) {
  return getUserStatus(user) === 'active';
}

export default function PlatformUserManagement() {
  const { data: users = [], isLoading, refetch } = useGetSuperAdminPlatformUsersQuery();
  const { data: roles = [] } = useGetSuperAdminRolesQuery();
  const [createUser, { isLoading: creating }] = useCreateSuperAdminPlatformUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateSuperAdminPlatformUserMutation();
  const [deleteUser] = useDeleteSuperAdminPlatformUserMutation();
  const [updateServiceRegistration, { isLoading: updatingService }] =
    useUpdateSuperAdminServiceRegistrationMutation();
  const [deleteServiceRegistration] = useDeleteSuperAdminServiceRegistrationMutation();

  const [platformForm, setPlatformForm] = useState(EMPTY_PLATFORM_FORM);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE_FORM);
  const [editingId, setEditingId] = useState('');
  const [editingSource, setEditingSource] = useState('platform');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingRoleFor, setSavingRoleFor] = useState('');
  const [savingStatusFor, setSavingStatusFor] = useState('');

  const assignableRoles = useMemo(
    () => roles.filter((role) => role.role_name !== 'SUPER_ADMIN'),
    [roles],
  );

  const serviceAdminRoles = useMemo(
    () => getServiceAdminRoles(roles),
    [roles],
  );

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === platformForm.roleId),
    [roles, platformForm.roleId],
  );

  const platformCount = users.filter((u) => !isServiceRegistration(u)).length;
  const serviceCount = users.filter(isServiceRegistration).length;

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

  const resetForm = () => {
    setPlatformForm(EMPTY_PLATFORM_FORM);
    setServiceForm(EMPTY_SERVICE_FORM);
    setEditingId('');
    setEditingSource('platform');
  };

  const handlePlatformSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: platformForm.name.trim(),
        email: platformForm.email.trim(),
        phone: platformForm.phone.trim(),
        roleId: platformForm.roleId,
        subRoleIds: platformForm.subRoleIds,
      };

      if (editingId) {
        await updateUser({ id: editingId, ...payload }).unwrap();
        notify('User updated.');
      } else {
        await createUser({ ...payload, password: platformForm.password }).unwrap();
        notify('User created.');
      }

      resetForm();
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to save user.'), true);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateServiceRegistration({
        id: editingId,
        organizationName: serviceForm.organizationName.trim(),
        description: serviceForm.description.trim(),
        registrant: {
          name: serviceForm.registrantName.trim(),
          email: serviceForm.registrantEmail.trim(),
          phone: serviceForm.registrantPhone.trim(),
          is_manager: serviceForm.is_manager,
        },
        ...(!serviceForm.is_manager && {
          manager: {
            name: serviceForm.managerName.trim(),
            email: serviceForm.managerEmail.trim(),
            phone: serviceForm.managerPhone.trim(),
          },
        }),
      }).unwrap();
      notify('Service registration updated.');
      resetForm();
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to update registration.'), true);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    if (isServiceRegistration(user)) {
      setEditingSource('service_registration');
      const registrant = user.registrant || {};
      const manager = user.manager || {};
      setServiceForm({
        organizationName: user.organizationName || '',
        description: user.description || '',
        registrantName: registrant.name || user.name || '',
        registrantEmail: registrant.email || '',
        registrantPhone: registrant.phone || '',
        is_manager: Boolean(registrant.is_manager),
        managerName: manager.name || '',
        managerEmail: manager.email || '',
        managerPhone: manager.phone || '',
      });
    } else {
      setEditingSource('platform');
      setPlatformForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        roleId: user.role?.role_id || '',
        subRoleIds: (user.role?.sub_roles || []).map((sr) => sr.id),
      });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.name}"?`)) return;
    try {
      if (isServiceRegistration(user)) {
        await deleteServiceRegistration(user.id).unwrap();
        notify('Service registration deleted.');
      } else {
        await deleteUser(user.id).unwrap();
        notify('User deleted.');
      }
      if (editingId === user.id) resetForm();
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to delete.'), true);
    }
  };

  const toggleSubRole = (subRoleId) => {
    setPlatformForm((prev) => ({
      ...prev,
      subRoleIds: prev.subRoleIds.includes(subRoleId)
        ? prev.subRoleIds.filter((id) => id !== subRoleId)
        : [...prev.subRoleIds, subRoleId],
    }));
  };

  const saveUserRole = async (user, roleId, subRoleIds) => {
    if (!roleId) return;
    if (isServiceRegistration(user) && !isUserActive(user)) {
      notify('Activate the user before assigning a role.', true);
      return;
    }
    const key = `${user.source || 'platform'}-${user.id}`;
    setSavingRoleFor(key);
    try {
      const payload = { id: user.id, roleId, subRoleIds };
      if (isServiceRegistration(user)) {
        const result = await updateServiceRegistration(payload).unwrap();
        if (result?.provision?.provisioned) {
          notify(
            result.provision.emailSent
              ? 'Role assigned. Activation email with login credentials sent.'
              : 'Role assigned. Credentials created (email may not have been sent).',
          );
        } else {
          notify('Role assigned.');
        }
      } else {
        await updateUser(payload).unwrap();
        notify('Role assigned.');
      }
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, 'Failed to assign role.'), true);
    } finally {
      setSavingRoleFor('');
    }
  };

  const handleInlineRoleChange = (user, roleId) => {
    if (!roleId) return;
    saveUserRole(user, roleId, []);
  };

  const handleInlineSubRoleToggle = (user, subRoleId) => {
    const roleId = user.role?.role_id;
    if (!roleId) return;
    const current = (user.role?.sub_roles || []).map((sr) => sr.id);
    const subRoleIds = current.includes(subRoleId)
      ? current.filter((id) => id !== subRoleId)
      : [...current, subRoleId];
    saveUserRole(user, roleId, subRoleIds);
  };

  const handleToggleStatus = async (user) => {
    const rowKey = `${user.source || 'platform'}-${user.id}`;
    const newStatus = isUserActive(user) ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${user.name}"?`)) {
      return;
    }

    setSavingStatusFor(rowKey);
    try {
      const payload = { id: user.id, status: newStatus };
      if (isServiceRegistration(user)) {
        const result = await updateServiceRegistration(payload).unwrap();
        if (newStatus === 'active' && result?.provision?.provisioned) {
          notify(
            result.provision.emailSent
              ? 'User activated. Login credentials emailed (valid 3 days).'
              : 'User activated. Credentials issued (email may not have been sent).',
          );
        } else {
          notify(newStatus === 'active' ? 'User activated.' : 'User deactivated.');
        }
      } else {
        await updateUser(payload).unwrap();
        notify(newStatus === 'active' ? 'User activated.' : 'User deactivated.');
      }
      refetch();
    } catch (err) {
      notify(getSuperAdminErrorMessage(err, `Failed to ${action} user.`), true);
    } finally {
      setSavingStatusFor('');
    }
  };

  const editingService = editingSource === 'service_registration';

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Platform users and service registrations ({platformCount} platform, {serviceCount}{' '}
                service).
              </p>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              error
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {error || message}
          </div>
        )}

        {editingService ? (
          <form
            onSubmit={handleServiceSubmit}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">Edit service registration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={serviceForm.organizationName}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, organizationName: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrant name
                </label>
                <input
                  type="text"
                  value={serviceForm.registrantName}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, registrantName: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrant email
                </label>
                <input
                  type="email"
                  value={serviceForm.registrantEmail}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, registrantEmail: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrant phone
                </label>
                <input
                  type="tel"
                  value={serviceForm.registrantPhone}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, registrantPhone: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={serviceForm.is_manager}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, is_manager: e.target.checked })
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Registrant is the manager
                </label>
              </div>
            </div>

            {!serviceForm.is_manager && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager name
                  </label>
                  <input
                    type="text"
                    value={serviceForm.managerName}
                    onChange={(e) => setServiceForm({ ...serviceForm, managerName: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager email
                  </label>
                  <input
                    type="email"
                    value={serviceForm.managerEmail}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, managerEmail: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager phone
                  </label>
                  <input
                    type="tel"
                    value={serviceForm.managerPhone}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, managerPhone: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updatingService}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {updatingService ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                Update registration
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handlePlatformSubmit}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit platform user' : 'Create platform user'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={platformForm.name}
                  onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={platformForm.email}
                  onChange={(e) => setPlatformForm({ ...platformForm, email: e.target.value })}
                  className={inputClass}
                  required
                  disabled={Boolean(editingId)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={platformForm.phone}
                  onChange={(e) => setPlatformForm({ ...platformForm, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={platformForm.password}
                    onChange={(e) => setPlatformForm({ ...platformForm, password: e.target.value })}
                    className={inputClass}
                    required={!editingId}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={platformForm.roleId}
                  onChange={(e) =>
                    setPlatformForm({ ...platformForm, roleId: e.target.value, subRoleIds: [] })
                  }
                  className={inputClass}
                  required
                >
                  <option value="">Select role</option>
                  {assignableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRole?.sub_roles?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-roles</label>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.sub_roles.map((subRole) => {
                    const selected = platformForm.subRoleIds.includes(subRole.id);
                    return (
                      <button
                        key={subRole.id}
                        type="button"
                        onClick={() => toggleSubRole(subRole.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        {subRole.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {creating || updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {editingId ? 'Update user' : 'Create user'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">All users ({users.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <p className="px-6 py-10 text-sm text-gray-500 text-center">No users yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role / Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Assign role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {users.map((user) => {
                    const service = isServiceRegistration(user);
                    const rowKey = `${user.source || 'platform'}-${user.id}`;
                    const savingRole = savingRoleFor === rowKey;
                    const savingStatus = savingStatusFor === rowKey;
                    const active = isUserActive(user);
                    return (
                      <tr
                        key={rowKey}
                        className={!active ? 'bg-gray-50/80' : undefined}
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              service
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {service ? 'Service' : 'Platform'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                              active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getUserStatus(user)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {service ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              <Building2 className="h-3 w-3" />
                              {user.serviceTitle || user.serviceId}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              <Shield className="h-3 w-3" />
                              {user.role?.role_name || '—'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {service ? user.organizationName || '—' : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <InlineRoleAssign
                            user={user}
                            roles={
                              service
                                ? rolesForServiceRegistration(
                                    user.serviceId,
                                    serviceAdminRoles.length > 0 ? serviceAdminRoles : assignableRoles,
                                  )
                                : assignableRoles
                            }
                            saving={savingRole}
                            disabled={service && !active}
                            disabledReason={
                              service && !active
                                ? 'Activate user to assign a service role'
                                : undefined
                            }
                            onRoleChange={handleInlineRoleChange}
                            onSubRoleToggle={handleInlineSubRoleToggle}
                          />
                          {service && user.activationEmailSentAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Credentials emailed
                              {user.credentialsExpiresAt &&
                                ` · expires ${new Date(
                                  user.credentialsExpiresAt,
                                ).toLocaleDateString()}`}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              disabled={savingStatus}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${
                                active
                                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {savingStatus ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
                              ) : active ? (
                                'Deactivate'
                              ) : (
                                'Activate'
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(user)}
                              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
