import { db } from '../utils/firebase.js';
import { hospitalCollection } from '../utils/hospitalCollection.js';

export const admitPatientWithBilling = async ({
  hospitalId,
  patientId,
  wardId,
  bedNumber,
  admissionFee
}) => {
  const firestore = db();

  await firestore.runTransaction(async (transaction) => {

    const wardRef = hospitalCollection(hospitalId, 'wards').doc(wardId);
    const wardSnap = await transaction.get(wardRef);

    if (!wardSnap.exists) {
      throw new Error('Ward not found');
    }

    const wardData = wardSnap.data();

    if (!wardData.availableBeds.includes(bedNumber)) {
      throw new Error('Bed not available');
    }

    // Remove bed from available
    const updatedBeds = wardData.availableBeds.filter(b => b !== bedNumber);

    transaction.update(wardRef, {
      availableBeds: updatedBeds,
      updatedAt: new Date()
    });

    // Create admission
    const admissionRef = hospitalCollection(hospitalId, 'admissions').doc();
    transaction.set(admissionRef, {
      patientId,
      wardId,
      bedNumber,
      status: 'ADMITTED',
      admittedAt: new Date()
    });

    // Create billing invoice
    const billingRef = hospitalCollection(hospitalId, 'billing').doc();
    transaction.set(billingRef, {
      patientId,
      admissionId: admissionRef.id,
      amount: admissionFee,
      status: 'UNPAID',
      createdAt: new Date()
    });
  });

  return { success: true };
};