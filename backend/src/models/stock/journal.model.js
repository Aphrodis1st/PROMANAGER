import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getJournalCollection = () => db().collection("journalEntries");

const JournalModel = {
  // Create a new journal entry (supports multiple debit/credit lines)
  async create(entry) {
    const journalCollection = getJournalCollection();
    const newDoc = journalCollection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const data = {
      ...entry,
      date: entry.date || new Date().toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(data);
    return { id: newDoc.id, ...data };
  },

  // Get all journal entries
  async findAll() {
    const journalCollection = getJournalCollection();
    const snapshot = await journalCollection.get();
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return docs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Remove a journal entry by ID
  async remove(id) {
    const journalCollection = getJournalCollection();
    await journalCollection.doc(id).delete();
    return true;
  },

  // Optional: get entries by account
  async findByAccount(accountId) {
    const journalCollection = getJournalCollection();
    const snapshot = await journalCollection.get();
    const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const filtered = allDocs.filter(doc => 
      doc.lines && doc.lines.some(line => line.accountId === accountId)
    );
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Get entries created by a source record, e.g. fixedAsset/expense.
  async findBySource(type, id) {
    const journalCollection = getJournalCollection();
    const snapshot = await journalCollection
      .where("source.type", "==", type)
      .where("source.id", "==", id)
      .get();

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Remove all journal entries created by a source record.
  async removeBySource(type, id) {
    const journalCollection = getJournalCollection();
    const snapshot = await journalCollection
      .where("source.type", "==", type)
      .where("source.id", "==", id)
      .get();

    const batch = db().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return snapshot.size;
  }
};

export default JournalModel;
