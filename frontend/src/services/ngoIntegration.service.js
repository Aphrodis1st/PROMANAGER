// NGO Integration Service - Connects all services dynamically
import axios from 'axios';

import { API_BASE_URL as API_BASE } from '../constants/api.js';

class NGOIntegrationService {
  constructor() {
    this.serviceConnections = {
      finance: {
        modules: ['budgets', 'grants', 'payroll', 'donorReports', 'bankAccounts'],
        endpoints: {
          budgets: '/stock/expenses',
          grants: '/ngo/grants',
          payroll: '/hr/payroll',
          donorReports: '/ngo/donor-reports',
          bankAccounts: '/stock/account-settings'
        }
      },
      gis: {
        modules: ['branches', 'fieldSites', 'visits', 'beneficiaries', 'gpsMapping'],
        endpoints: {
          branches: '/ngo/branches',
          fieldSites: '/ngo/field-sites',
          visits: '/ngo/field-visits',
          beneficiaries: '/ngo/beneficiaries',
          gpsMapping: '/ngo/gps-locations'
        }
      },
      hr: {
        modules: ['staff', 'departments', 'orgChart', 'permissions', 'documents'],
        endpoints: {
          staff: '/hr/employees',
          departments: '/hr/departments',
          orgChart: '/hr/org-chart',
          permissions: '/ngo/permissions',
          documents: '/ngo/documents'
        }
      },
      church: {
        modules: ['churchBranches', 'offerings', 'pastoralVisits', 'attendance', 'members'],
        endpoints: {
          churchBranches: '/ngo/branches?type=church',
          offerings: '/ngo/offerings',
          pastoralVisits: '/ngo/pastoral-visits',
          attendance: '/ngo/attendance',
          members: '/ngo/members'
        }
      },
      procurement: {
        modules: ['reliefStock', 'purchaseRequests', 'distributionTracking', 'suppliers', 'inventory'],
        endpoints: {
          reliefStock: '/stock/inventory?category=relief',
          purchaseRequests: '/stock/purchases',
          distributionTracking: '/ngo/distributions',
          suppliers: '/stock/supplier',
          inventory: '/stock/inventory'
        }
      },
      communication: {
        modules: ['announcements', 'sms', 'whatsapp', 'emailCampaigns', 'notifications'],
        endpoints: {
          announcements: '/ngo/announcements',
          sms: '/ngo/sms',
          whatsapp: '/ngo/whatsapp',
          emailCampaigns: '/ngo/email-campaigns',
          notifications: '/ngo/notifications'
        }
      },
      projects: {
        modules: ['programs', 'donors', 'beneficiaries', 'volunteers', 'reports'],
        endpoints: {
          programs: '/ngo/programs',
          donors: '/ngo/donors',
          beneficiaries: '/ngo/beneficiaries',
          volunteers: '/ngo/volunteers',
          reports: '/ngo/reports'
        }
      },
      reports: {
        modules: ['financial', 'field', 'hr', 'donor', 'compliance'],
        endpoints: {
          financial: '/stock/reports-dashboard',
          field: '/ngo/field-reports',
          hr: '/hr/dashboard',
          donor: '/ngo/donor-reports',
          compliance: '/ngo/compliance-reports'
        }
      }
    };
  }

  // Get real-time module counts for a service
  async getServiceModuleCount(serviceKey) {
    const service = this.serviceConnections[serviceKey];
    if (!service) return 0;

    let totalCount = 0;
    for (const [module, endpoint] of Object.entries(service.endpoints)) {
      try {
        const response = await axios.get(`${API_BASE}${endpoint}`);
        const data = response.data?.data || response.data;
        totalCount += Array.isArray(data) ? data.length : (data?.length || 0);
      } catch (error) {
        console.warn(`Failed to fetch ${module}:`, error.message);
      }
    }
    return totalCount;
  }

  // Get all service statuses with real counts
  async getAllServiceStatuses(workspace) {
    const statuses = {};
    
    for (const [key, service] of Object.entries(this.serviceConnections)) {
      const serviceControl = workspace.serviceControls.find(s => 
        s.service.toLowerCase().includes(key) || key.includes(s.service.toLowerCase())
      );
      
      statuses[key] = {
        enabled: serviceControl?.status === 'Enabled',
        moduleCount: await this.getServiceModuleCount(key),
        modules: service.modules,
        endpoints: service.endpoints,
        owner: serviceControl?.owner || 'Not assigned',
        linkedModules: serviceControl?.linkedModule || ''
      };
    }
    
    return statuses;
  }

  // Check if a service has active data
  async hasActiveData(serviceKey, workspace) {
    const count = await this.getServiceModuleCount(serviceKey);
    return count > 0;
  }

  // Get cross-service permissions
  getCrossServicePermissions(workspace) {
    const permissionMap = {};
    
    workspace.roles.forEach(role => {
      role.permissions.forEach(permission => {
        if (!permissionMap[permission]) {
          permissionMap[permission] = [];
        }
        permissionMap[permission].push({
          role: role.name,
          scope: role.scope,
          approvalLimit: role.approvalLimit
        });
      });
    });
    
    return permissionMap;
  }

  // Get unified audit trail across all services
  getUnifiedAuditTrail(workspace) {
    return workspace.auditEvents.map(event => ({
      ...event,
      service: this.detectServiceFromMessage(event.message),
      timestamp: new Date(event.at)
    })).sort((a, b) => b.timestamp - a.timestamp);
  }

  // Detect which service an audit event belongs to
  detectServiceFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('grant') || lowerMessage.includes('budget') || lowerMessage.includes('payroll')) return 'Finance';
    if (lowerMessage.includes('branch') || lowerMessage.includes('field') || lowerMessage.includes('gps')) return 'GIS';
    if (lowerMessage.includes('staff') || lowerMessage.includes('employee') || lowerMessage.includes('department')) return 'HR';
    if (lowerMessage.includes('church') || lowerMessage.includes('pastor') || lowerMessage.includes('offering')) return 'Church';
    if (lowerMessage.includes('stock') || lowerMessage.includes('procurement') || lowerMessage.includes('purchase')) return 'Procurement';
    if (lowerMessage.includes('communication') || lowerMessage.includes('sms') || lowerMessage.includes('email')) return 'Communication';
    if (lowerMessage.includes('project') || lowerMessage.includes('donor') || lowerMessage.includes('beneficiary')) return 'Projects';
    if (lowerMessage.includes('report')) return 'Reports';
    return 'Organization';
  }

  // Get service health status
  async getServiceHealth(workspace) {
    const health = {};
    
    for (const serviceControl of workspace.serviceControls) {
      const serviceKey = this.getServiceKey(serviceControl.service);
      const moduleCount = await this.getServiceModuleCount(serviceKey);
      
      health[serviceControl.service] = {
        status: serviceControl.status,
        moduleCount,
        hasData: moduleCount > 0,
        owner: serviceControl.owner,
        linkedModules: serviceControl.linkedModule,
        health: this.calculateHealth(serviceControl, moduleCount)
      };
    }
    
    return health;
  }

  // Calculate service health score
  calculateHealth(serviceControl, moduleCount) {
    if (serviceControl.status !== 'Enabled') return 'warning';
    if (moduleCount === 0) return 'warning';
    if (!serviceControl.owner) return 'warning';
    return 'healthy';
  }

  // Get service key from service name
  getServiceKey(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes('finance')) return 'finance';
    if (name.includes('gis') || name.includes('field')) return 'gis';
    if (name.includes('hr') || name.includes('staff')) return 'hr';
    if (name.includes('church')) return 'church';
    if (name.includes('procurement') || name.includes('stock')) return 'procurement';
    if (name.includes('communication')) return 'communication';
    if (name.includes('project') || name.includes('program')) return 'projects';
    if (name.includes('report')) return 'reports';
    return 'other';
  }

  // Sync workspace data with backend
  async syncWithBackend(workspace, organizationId) {
    try {
      const response = await axios.put(
        `${API_BASE}/super-admin/ngos/${organizationId}`,
        {
          workspace,
          lastSync: new Date().toISOString()
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get integration recommendations
  getIntegrationRecommendations(workspace) {
    const recommendations = [];
    
    // Check if finance service is enabled but no grants
    if (workspace.serviceControls.some(s => s.service.includes('Finance') && s.status === 'Enabled')) {
      if (workspace.grants.length === 0) {
        recommendations.push({
          service: 'Finance',
          message: 'Add grants to track donor funding',
          priority: 'high'
        });
      }
      if (workspace.chartOfAccounts.length === 0) {
        recommendations.push({
          service: 'Finance',
          message: 'Set up chart of accounts for proper accounting',
          priority: 'high'
        });
      }
    }
    
    // Check if GIS is enabled but no field sites
    if (workspace.serviceControls.some(s => s.service.includes('GIS') && s.status === 'Enabled')) {
      if (workspace.fieldSites.length === 0) {
        recommendations.push({
          service: 'GIS',
          message: 'Map field sites with GPS coordinates',
          priority: 'medium'
        });
      }
    }
    
    // Check if HR is enabled but no staff
    if (workspace.serviceControls.some(s => s.service.includes('HR') && s.status === 'Enabled')) {
      if (workspace.staff.length === 0) {
        recommendations.push({
          service: 'HR',
          message: 'Add staff members to build organizational chart',
          priority: 'high'
        });
      }
    }
    
    // Check role coverage
    const allPermissions = ['finance', 'gis', 'hr', 'church', 'procurement', 'communication', 'projects', 'reports'];
    const coveredPermissions = [...new Set(workspace.roles.flatMap(r => r.permissions))];
    const missingPermissions = allPermissions.filter(p => !coveredPermissions.includes(p));
    
    if (missingPermissions.length > 0) {
      recommendations.push({
        service: 'Roles',
        message: `Add roles with permissions: ${missingPermissions.join(', ')}`,
        priority: 'medium'
      });
    }
    
    return recommendations;
  }
}

export default new NGOIntegrationService();
