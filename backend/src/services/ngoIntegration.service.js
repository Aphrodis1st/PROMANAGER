import { db } from '../../utils/firebase.js';

export class NGOIntegrationService {
  // Get complete organization overview with all linked data
  static async getOrganizationOverview(organizationId) {
    const [projects, tenders, contracts, impacts, evaluations] = await Promise.all([
      db().collection('ngo_projects').where('organizationId', '==', organizationId).get(),
      db().collection('ngo_tenders').where('organizationId', '==', organizationId).get(),
      db().collection('ngo_contracts').where('organizationId', '==', organizationId).get(),
      db().collection('ngo_impacts').where('organizationId', '==', organizationId).get(),
      db().collection('ngo_evaluations').where('organizationId', '==', organizationId).get()
    ]);

    return {
      projects: projects.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      tenders: tenders.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      contracts: contracts.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      impacts: impacts.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      evaluations: evaluations.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  }

  // Get project with all related data
  static async getProjectDetails(projectId) {
    const [project, tenders, contracts, impacts, evaluations] = await Promise.all([
      db().collection('ngo_projects').doc(projectId).get(),
      db().collection('ngo_tenders').where('projectId', '==', projectId).get(),
      db().collection('ngo_contracts').where('projectId', '==', projectId).get(),
      db().collection('ngo_impacts').where('projectId', '==', projectId).get(),
      db().collection('ngo_evaluations').where('projectId', '==', projectId).get()
    ]);

    if (!project.exists) return null;

    return {
      project: { id: project.id, ...project.data() },
      tenders: tenders.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      contracts: contracts.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      impacts: impacts.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      evaluations: evaluations.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  }

  // Get tender with related contract
  static async getTenderDetails(tenderId) {
    const [tender, contracts] = await Promise.all([
      db().collection('ngo_tenders').doc(tenderId).get(),
      db().collection('ngo_contracts').where('tenderId', '==', tenderId).get()
    ]);

    if (!tender.exists) return null;

    return {
      tender: { id: tender.id, ...tender.data() },
      contracts: contracts.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  }

  // Link tender to project
  static async linkTenderToProject(tenderId, projectId) {
    await db().collection('ngo_tenders').doc(tenderId).update({
      projectId,
      updatedAt: new Date()
    });
  }

  // Link contract to tender and project
  static async linkContractToTenderAndProject(contractId, tenderId, projectId) {
    await db().collection('ngo_contracts').doc(contractId).update({
      tenderId,
      projectId,
      updatedAt: new Date()
    });
  }

  // Link impact to project
  static async linkImpactToProject(impactId, projectId) {
    await db().collection('ngo_impacts').doc(impactId).update({
      projectId,
      updatedAt: new Date()
    });
  }

  // Link evaluation to project
  static async linkEvaluationToProject(evaluationId, projectId) {
    await db().collection('ngo_evaluations').doc(evaluationId).update({
      projectId,
      updatedAt: new Date()
    });
  }
}
