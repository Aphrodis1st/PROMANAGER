// models/production/productionCounter.model.js
import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

export const ProductionCounterModel = {
  /**
   * Get the next plan number in format: 001, 002, 003, etc.
   */
  async getNextPlanNumber() {
    const counterRef = db().collection("counters").doc("productionPlanCounter");

    try {
      const result = await db().runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);

        let currentCount = 0;
        if (doc.exists) {
          currentCount = doc.data().count || 0;
        }

        const newCount = currentCount + 1;
        const planNumber = String(newCount).padStart(3, "0");

        transaction.set(
          counterRef,
          {
            count: newCount,
            lastPlanNumber: planNumber,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        return planNumber;
      });

      return result;
    } catch (error) {
      console.error("❌ Error generating plan number:", error);
      throw new Error("Failed to generate plan number");
    }
  },

  /**
   * Get the next cycle number in format: 001, 002, 003, etc.
   */
  async getNextCycleNumber() {
    const counterRef = db().collection("counters").doc("productionCycleCounter");

    try {
      const result = await db().runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);

        let currentCount = 0;
        if (doc.exists) {
          currentCount = doc.data().count || 0;
        }

        const newCount = currentCount + 1;
        const cycleNumber = String(newCount).padStart(3, "0");

        transaction.set(
          counterRef,
          {
            count: newCount,
            lastCycleNumber: cycleNumber,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        return cycleNumber;
      });

      return result;
    } catch (error) {
      console.error("❌ Error generating cycle number:", error);
      throw new Error("Failed to generate cycle number");
    }
  },

  /**
   * Get current counters (for debugging/admin purposes)
   */
  async getCurrentCounters() {
    const planRef = db().collection("counters").doc("productionPlanCounter");
    const cycleRef = db().collection("counters").doc("productionCycleCounter");

    const [planDoc, cycleDoc] = await Promise.all([
      planRef.get(),
      cycleRef.get(),
    ]);

    return {
      plans: planDoc.exists ? planDoc.data() : { count: 0, lastPlanNumber: null },
      cycles: cycleDoc.exists ? cycleDoc.data() : { count: 0, lastCycleNumber: null },
    };
  },

  /**
   * Reset counters (use with caution!)
   */
  async resetCounters() {
    const planRef = db().collection("counters").doc("productionPlanCounter");
    const cycleRef = db().collection("counters").doc("productionCycleCounter");

    await Promise.all([
      planRef.set({
        count: 0,
        lastPlanNumber: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
      cycleRef.set({
        count: 0,
        lastCycleNumber: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ]);

    return { success: true, message: "All counters reset to 0" };
  },
};
