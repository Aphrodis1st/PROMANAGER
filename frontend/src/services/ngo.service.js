import axios from 'axios';
import { getServiceToken } from '../utils/authCookies.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://monkfish-app-zg4hx.ondigitalocean.app/api/v1';

const ngoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if available
ngoApi.interceptors.request.use((config) => {
  const token = getServiceToken('ngo') || getServiceToken('stock');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle errors
ngoApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

// Dashboard
export const dashboardService = {
  getOverview: async () => {
    const response = await ngoApi.get('/ngo/dashboard');
    return response.data;
  }
};

// Organizations
export const organizationService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.country) params.append('country', filters.country);
    
    const response = await ngoApi.get(`/ngo/organizations?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/organizations/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/organizations', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/organizations/${id}`);
    return response;
  },

  getStats: async (id) => {
    const response = await ngoApi.get(`/ngo/organizations/${id}/stats`);
    return response.data;
  }
};

// Branches
export const branchService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.country) params.append('country', filters.country);
    
    const response = await ngoApi.get(`/ngo/branches?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/branches/${id}`);
    return response.data;
  },

  getByOrganization: async (organizationId) => {
    const response = await ngoApi.get(`/ngo/branches/organization/${organizationId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/branches', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/branches/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/branches/${id}`);
    return response;
  }
};

// Departments
export const departmentService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.branchId) params.append('branchId', filters.branchId);
    if (filters.status) params.append('status', filters.status);

    const response = await ngoApi.get(`/ngo/departments?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/departments/${id}`);
    return response.data;
  },

  getByBranch: async (branchId) => {
    const response = await ngoApi.get(`/ngo/departments/branch/${branchId}`);
    return response.data;
  },

  getHierarchy: async (organizationId) => {
    const response = await ngoApi.get(`/ngo/departments/hierarchy/${organizationId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/departments', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/departments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/departments/${id}`);
    return response;
  }
};

// Projects
export const projectService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.status) params.append('status', filters.status);
    
    const response = await ngoApi.get(`/ngo/projects?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/projects', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/projects/${id}`);
    return response;
  }
};

// Roles
export const roleService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.status) params.append('status', filters.status);
    if (filters.scope) params.append('scope', filters.scope);
    if (filters.isSystemRole !== undefined && filters.isSystemRole !== '') {
      params.append('isSystemRole', String(filters.isSystemRole));
    }

    const response = await ngoApi.get(`/ngo/roles?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/roles/${id}`);
    return response.data;
  },

  getByDepartment: async (departmentId) => {
    const response = await ngoApi.get(`/ngo/roles/department/${departmentId}`);
    return response.data;
  },

  getHierarchy: async (organizationId) => {
    const response = await ngoApi.get(`/ngo/roles/hierarchy/${organizationId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/roles', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/roles/${id}`, data);
    return response.data;
  },

  assignPermissions: async (id, permissions) => {
    const response = await ngoApi.put(`/ngo/roles/${id}/permissions`, { permissions });
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/roles/${id}`);
    return response;
  }
};

// Users/Staff
export const staffService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.branchId) params.append('branchId', filters.branchId);
    if (filters.roleId) params.append('roleId', filters.roleId);
    if (filters.accountStatus) params.append('accountStatus', filters.accountStatus);

    const response = await ngoApi.get(`/ngo/users?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await ngoApi.get(`/ngo/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await ngoApi.post('/ngo/users', data);
    return {
      ...response.data,
      emailSent: response.emailSent ?? response.data?.emailSent,
      emailError: response.emailError ?? response.data?.emailError,
    };
  },

  update: async (id, data) => {
    const response = await ngoApi.put(`/ngo/users/${id}`, data);
    return response.data;
  },

  activate: async (id, approvedBy = '') => {
    const response = await ngoApi.put(`/ngo/users/${id}/activate`, { approvedBy });
    return response.data;
  },

  suspend: async (id, payload = {}) => {
    const response = await ngoApi.put(`/ngo/users/${id}/suspend`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await ngoApi.delete(`/ngo/users/${id}`);
    return response;
  }
};

export default ngoApi;
