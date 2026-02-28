import { hospitalCollection } from '../utils/hospitalCollection.js';

export const trackActivity = async ({
  hospitalId,
  userId,
  type,
  description
}) => {
  await hospitalCollection(hospitalId, 'activityLogs').add({
    userId,
    type,
    description,
    createdAt: new Date()
  });
};