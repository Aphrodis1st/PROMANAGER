import { API_BASE_URL } from '../constants/api';

class HospitalAdminService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/hospital/admin`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('hospitalToken');
    
    if (!token) {
      console.error('No hospitalToken found in localStorage');
      console.log('Available localStorage keys:', Object.keys(localStorage));
      throw new Error('No authentication token found. Please login again.');
    }
    
    console.log('Using token:', token.substring(0, 20) + '...');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('getDashboardStats error:', error);
      throw error;
    }
  }

  // User Management
  async getUserManagement() {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch users`);
      }
      
      return response.json();
    } catch (error) {
      console.error('getUserManagement error:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      return response.json();
    } catch (error) {
      console.error('createUser error:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      return response.json();
    } catch (error) {
      console.error('updateUser error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      return response.json();
    } catch (error) {
      console.error('deleteUser error:', error);
      throw error;
    }
  }

  async assignRole(userId, roleData) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/role`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(roleData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign role');
      }
      
      return response.json();
    } catch (error) {
      console.error('assignRole error:', error);
      throw error;
    }
  }

  async resetUserPassword(userId, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/reset-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ newPassword })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      
      return response.json();
    } catch (error) {
      console.error('resetUserPassword error:', error);
      throw error;
    }
  }

  async toggleUserAccess(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/toggle-access`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle user access');
      }
      
      return response.json();
    } catch (error) {
      console.error('toggleUserAccess error:', error);
      throw error;
    }
  }

  // Department Management
  async getDepartmentManagement() {
    try {
      const response = await fetch(`${this.baseURL}/departments`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch departments');
      }
      
      return response.json();
    } catch (error) {
      console.error('getDepartmentManagement error:', error);
      throw error;
    }
  }

  async createDepartment(departmentData) {
    try {
      const response = await fetch(`${this.baseURL}/departments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(departmentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create department');
      }
      
      return response.json();
    } catch (error) {
      console.error('createDepartment error:', error);
      throw error;
    }
  }

  async updateDepartment(deptId, departmentData) {
    try {
      const response = await fetch(`${this.baseURL}/departments/${deptId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(departmentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update department');
      }
      
      return response.json();
    } catch (error) {
      console.error('updateDepartment error:', error);
      throw error;
    }
  }

  async deleteDepartment(deptId) {
    try {
      const response = await fetch(`${this.baseURL}/departments/${deptId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete department');
      }
      
      return response.json();
    } catch (error) {
      console.error('deleteDepartment error:', error);
      throw error;
    }
  }

  // Staff Management
  async getStaffManagement() {
    try {
      const response = await fetch(`${this.baseURL}/staff`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      return response.json();
    } catch (error) {
      console.error('getStaffManagement error:', error);
      throw error;
    }
  }

  async assignStaffToDepartment(staffId, assignmentData) {
    try {
      const response = await fetch(`${this.baseURL}/staff/${staffId}/department`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(assignmentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign staff to department');
      }
      
      return response.json();
    } catch (error) {
      console.error('assignStaffToDepartment error:', error);
      throw error;
    }
  }

  // Patient Management
  async getPatientManagement() {
    try {
      const response = await fetch(`${this.baseURL}/patients`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      
      return response.json();
    } catch (error) {
      console.error('getPatientManagement error:', error);
      throw error;
    }
  }

  // Appointment System
  async getAppointmentSystem() {
    try {
      const response = await fetch(`${this.baseURL}/appointments`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      return response.json();
    } catch (error) {
      console.error('getAppointmentSystem error:', error);
      throw error;
    }
  }

  // Sub Admin Management
  async createSubAdmin(subAdminData) {
    try {
      const response = await fetch(`${this.baseURL}/sub-admin`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subAdminData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create sub admin');
      }
      
      return response.json();
    } catch (error) {
      console.error('createSubAdmin error:', error);
      throw error;
    }
  }

  // Access Control
  async getAccessControl() {
    try {
      const response = await fetch(`${this.baseURL}/access-control`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch access control data');
      }
      
      return response.json();
    } catch (error) {
      console.error('getAccessControl error:', error);
      throw error;
    }
  }

  async assignDepartmentHead(deptId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/departments/${deptId}/head`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign department head');
      }
      
      return response.json();
    } catch (error) {
      console.error('assignDepartmentHead error:', error);
      throw error;
    }
  }

  async getProfessionalRoles() {
    try {
      const response = await fetch(`${this.baseURL}/roles`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch professional roles');
      }
      
      return response.json();
    } catch (error) {
      console.error('getProfessionalRoles error:', error);
      throw error;
    }
  }

  async getStaffByDepartment(deptId) {
    try {
      const response = await fetch(`${this.baseURL}/departments/${deptId}/staff`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      return response.json();
    } catch (error) {
      console.error('getStaffByDepartment error:', error);
      throw error;
    }
  }

  async updatePermissions(userId, permissions) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/permissions`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ permissions })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update permissions');
      }
      
      return response.json();
    } catch (error) {
      console.error('updatePermissions error:', error);
      throw error;
    }
  }

  async updatePermissions(userId, permissions) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/permissions`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ permissions })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update permissions');
      }
      
      return response.json();
    } catch (error) {
      console.error('updatePermissions error:', error);
      throw error;
    }
  }

  async changeUserRole(userId, newRole) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/role`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to change role');
      }
      
      return response.json();
    } catch (error) {
      console.error('changeUserRole error:', error);
      throw error;
    }
  }

  async setPartialPassword(userId, partialPassword) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/partial-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ partialPassword, requirePasswordChange: true })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to set partial password');
      }
      
      return response.json();
    } catch (error) {
      console.error('setPartialPassword error:', error);
      throw error;
    }
  }

  async bulkUpdateUserStatus(userIds, status) {
    try {
      const response = await fetch(`${this.baseURL}/users/bulk/status`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userIds, status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      return response.json();
    } catch (error) {
      console.error('bulkUpdateUserStatus error:', error);
      throw error;
    }
  }

  async bulkDeleteUsers(userIds) {
    try {
      const response = await fetch(`${this.baseURL}/users/bulk/delete`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete users');
      }
      
      return response.json();
    } catch (error) {
      console.error('bulkDeleteUsers error:', error);
      throw error;
    }
  }
}

export const hospitalAdminService = new HospitalAdminService();
