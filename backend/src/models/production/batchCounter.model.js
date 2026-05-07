// models/production/batchCounter.model.js
import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const COUNTER_DOC_ID = "productionBatchCounter";

export const BatchCounterModel = {
  /**
   * Get the next batch number in format: 001, 002, 003, etc.
   */
  async getNextBatchNumber() {
    const counterRef = db().collection("counters").doc(COUNTER_DOC_ID);

    try {
      const result = await db().runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);

        let currentCount = 0;
        if (doc.exists) {
          currentCount = doc.data().count || 0;
        }

        const newCount = currentCount + 1;
        const batchNumber = String(newCount).padStart(3, "0");

        // Update or create the counter
        transaction.set(
          counterRef,
          {
            count: newCount,
            lastBatchNumber: batchNumber,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        return batchNumber;
      });

      return result;
    } catch (error) {
      console.error("❌ Error generating batch number:", error);
      throw new Error("Failed to generate batch number");
    }
  },

  /**
   * Get current counter value (for debugging/admin purposes)
   */
  async getCurrentCount() {
    const counterRef = db().collection("counters").doc(COUNTER_DOC_ID);
    const doc = await counterRef.get();

    if (!doc.exists) {
      return { count: 0, lastBatchNumber: null };
    }

    return doc.data();
  },

  /**
   * Reset counter (use with caution!)
   */
  async resetCounter() {
    const counterRef = db().collection("counters").doc(COUNTER_DOC_ID);
    await counterRef.set({
      count: 0,
      lastBatchNumber: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, message: "Counter reset to 0" };
  },
};
