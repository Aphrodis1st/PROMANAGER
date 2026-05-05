import { HROrganization } from '../../models/superAdmin/hrOrganization.model.js';
import { HRAdmin } from '../../models/superAdmin/hrAdmin.model.js';

export const hrOrganizationController = {
  // Get all HR organizations
  async getAll(req, res) {
    try {
      const organizations = await HROrganization.getAll();
      res.json({ success: true, data: organizations });
    } catch (error) {
      console.error('Error fetching HR organizations:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get HR organization by ID
  async getById(req, res) {
    try {
      const organization = await HROrganization.getById(req.params.id);
      if (!organization) {
        return res.status(404).json({ success: false, message: 'HR organization not found' });
      }
      res.json({ success: true, data: organization });
    } catch (error) {
      console.error('Error fetching HR organization:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new HR organization
  async create(req, res) {
    try {
      const { name, location, contactInfo, subscriptionPlan, featuresEnabled } = req.body;
      
      const organizationData = {
        name,
        location,
        contactInfo,
        subscriptionPlan: subscriptionPlan || 'basic',
        featuresEnabled: featuresEnabled || [],
        status: 'active',
        isDeleted: false
      };

      const organization = await HROrganization.create(organizationData);
      res.status(201).json({ success: true, data: organization });
    } catch (error) {
      console.error('Error creating HR organization:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update HR organization
  async update(req, res) {
    try {
      const { name, location, contactInfo, subscriptionPlan, featuresEnabled } = req.body;
      
      const updateData = {};
      if (name) updateData.name = name;
      if (location) updateData.location = location;
      if (contactInfo) updateData.contactInfo = contactInfo;
      if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan;
      if (featuresEnabled) updateData.featuresEnabled = featuresEnabled;

      const organization = await HROrganization.update(req.params.id, updateData);
      res.json({ success: true, data: organization });
    } catch (error) {
      console.error('Error updating HR organization:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update organization status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const organization = await HROrganization.updateStatus(req.params.id, status);
      res.json({ success: true, data: organization });
    } catch (error) {
      console.error('Error updating organization status:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update organization features
  async updateFeatures(req, res) {
    try {
      const { features } = req.body;
      const organization = await HROrganization.update(req.params.id, { featuresEnabled: features });
      res.json({ success: true, data: organization });
    } catch (error) {
      console.error('Error updating organization features:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete HR organization
  async delete(req, res) {
    try {
      await HROrganization.delete(req.params.id);
      res.json({ success: true, message: 'HR organization deleted successfully' });
    } catch (error) {
      console.error('Error deleting HR organization:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get admins by organization
  async getAdmins(req, res) {
    try {
      const admins = await HRAdmin.getByOrganization(req.params.id);
      res.json({ success: true, data: admins });
    } catch (error) {
      console.error('Error fetching organization admins:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
