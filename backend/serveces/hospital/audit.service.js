import { hospitalCollection } from '../utils/hospitalCollection.js';

export const logAudit = async ({
  hospitalId,
  userId,
  action,
  module,
  metadata = {}
}) => {
  const ref = hospitalCollection(hospitalId, 'auditLogs').doc();

  await ref.set({
    userId,
    action,
    module,
    metadata,
    createdAt: new Date()
  });
};