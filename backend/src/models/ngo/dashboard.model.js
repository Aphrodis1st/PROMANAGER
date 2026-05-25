import { db } from '../../../utils/firebase.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value._seconds === 'number') return value._seconds * 1000;
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function isActiveStatus(status) {
  const normalized = String(status || 'active').toLowerCase();
  return normalized === 'active' || normalized === '';
}

function isRecent(value) {
  const ms = toMillis(value);
  return ms > 0 && Date.now() - ms <= THIRTY_DAYS_MS;
}

function formatRelativeTime(value) {
  const ms = toMillis(value);
  if (!ms) return 'Recently';

  const diffSec = Math.floor((Date.now() - ms) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
  return new Date(ms).toLocaleDateString();
}

function mapProjectOverview(doc) {
  const data = doc.data();
  const budget = Number(data.budget ?? data.totalBudget ?? data.allocatedBudget ?? 0);
  const completion = Number(
    data.completion ?? data.completionPercent ?? data.progress ?? 0
  );

  return {
    id: doc.id,
    name: data.name || data.title || data.projectName || 'Untitled Project',
    status: data.status || 'planning',
    budget,
    completion: Math.min(100, Math.max(0, completion))
  };
}

function activityFromRecord(type, action, record) {
  const timestamp = record.updatedAt || record.createdAt;
  let details = record.name || record.title || '';

  if (type === 'organization') details = `${record.name || 'Organization'} registered`;
  if (type === 'branch') details = `${record.name || 'Branch'} — ${record.city || record.country || ''}`.trim();
  if (type === 'staff') details = `${record.fullName || record.name || record.email || 'New staff member'}`;
  if (type === 'project') details = record.name || record.title || 'New project';
  if (type === 'grant') details = `${record.donor || record.name || 'Grant'}${record.amount ? ` — ${record.amount}` : ''}`;

  return {
    type,
    action,
    details: details || 'Record updated',
    timestamp: toMillis(timestamp),
    time: formatRelativeTime(timestamp)
  };
}

export class Dashboard {
  static async getOverview(organizationId) {
    if (!organizationId) {
      throw Object.assign(new Error('Organization context is required'), { status: 400 });
    }

    const dbInst = db();
    const orgDoc = await dbInst.collection('ngo_organizations').doc(organizationId).get();
    if (!orgDoc.exists) {
      throw Object.assign(new Error('Organization not found'), { status: 404 });
    }
    const organization = { id: orgDoc.id, ...orgDoc.data() };

    const [
      branchesSnap,
      departmentsSnap,
      usersSnap,
      projectsSnap,
      grantsSnap,
      financesSnap
    ] = await Promise.all([
      dbInst.collection('ngo_branches').where('organizationId', '==', organizationId).get(),
      dbInst.collection('ngo_departments').where('organizationId', '==', organizationId).get(),
      dbInst.collection('ngo_users').where('organizationId', '==', organizationId).get(),
      dbInst.collection('ngo_projects').where('organizationId', '==', organizationId).get(),
      dbInst.collection('ngo_grants').where('organizationId', '==', organizationId).get(),
      dbInst.collection('ngo_finances').where('organizationId', '==', organizationId).get()
    ]);

    const branches = branchesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const departments = departmentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const users = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const projects = projectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const grants = grantsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const finances = financesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const activeBranches = branches.filter((b) => isActiveStatus(b.status));
    const activeProjects = projects.filter((p) => {
      const status = String(p.status || '').toLowerCase();
      return status === 'active' || status === 'in progress' || status === 'ongoing';
    });

    const totalProjectBudget = projects.reduce(
      (sum, p) => sum + Number(p.budget ?? p.totalBudget ?? p.allocatedBudget ?? 0),
      0
    );

    const fundsRaised = grants.reduce((sum, g) => sum + Number(g.amount ?? g.totalAmount ?? 0), 0)
      + finances
        .filter((f) => String(f.type || '').toLowerCase() === 'income')
        .reduce((sum, f) => sum + Number(f.amount ?? 0), 0);

    const recentActivities = [
      activityFromRecord('organization', 'Organization Profile', organization),
      ...branches.map((r) => activityFromRecord('branch', 'Branch Added', r)),
      ...users.map((r) => activityFromRecord('staff', 'Staff Member Added', r)),
      ...projects.map((r) => activityFromRecord('project', 'Project Created', r)),
      ...grants.map((r) => activityFromRecord('grant', 'Grant Recorded', r))
    ]
      .filter((a) => a.timestamp > 0)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    const projectsOverview = projectsSnap.docs
      .map(mapProjectOverview)
      .sort((a, b) => b.completion - a.completion)
      .slice(0, 6);

    const countRecent = (items) =>
      items.filter((item) => isRecent(item.createdAt)).length;

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        status: organization.status,
        type: organization.type,
      },
      stats: {
        totalOrganizations: 1,
        activeOrganizations: isActiveStatus(organization.status) ? 1 : 0,
        organizationsThisMonth: isRecent(organization.createdAt) ? 1 : 0,
        totalBranches: branches.length,
        activeBranches: activeBranches.length,
        branchesThisMonth: countRecent(branches),
        totalStaff: users.length,
        staffThisMonth: countRecent(users),
        totalDepartments: departments.length,
        activeProjects: activeProjects.length,
        totalProjects: projects.length,
        projectsThisMonth: countRecent(projects),
        totalBudget: totalProjectBudget,
        fundsRaised
      },
      recentActivities,
      projectsOverview
    };
  }
}
