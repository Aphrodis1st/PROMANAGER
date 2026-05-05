import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getGLAccountCollection = () => db().collection("glAccounts");

export const GLAccountModel = {
  async create(data) {
    const collection = getGLAccountCollection();
    const newDoc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      glCode: data.glCode || "",
      glAccountName: data.glAccountName || "",
      accountType: data.accountType || "Liability", // Asset, Liability, Equity, Revenue, Expense
      category: data.category || "Tax", // Tax, Inventory, Revenue, etc.
      usedWhen: data.usedWhen || "",
      meaning: data.meaning || "",
      parentAccount: data.parentAccount || null,
      isActive: data.isActive !== false,
      balance: Number(data.balance) || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async getAll() {
    const collection = getGLAccountCollection();
    const snapshot = await collection.orderBy("glCode", "asc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getByCode(glCode) {
    const collection = getGLAccountCollection();
    const snapshot = await collection.where("glCode", "==", glCode).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async getById(id) {
    const collection = getGLAccountCollection();
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const collection = getGLAccountCollection();
    const ref = collection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const updatedData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updatedData);
    return { id, ...existing.data(), ...updatedData };
  },

  async updateBalance(id, amount, operation = "add") {
    const collection = getGLAccountCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;

    const currentBalance = Number(doc.data().balance) || 0;
    const newBalance = operation === "add" 
      ? currentBalance + Number(amount)
      : currentBalance - Number(amount);

    await ref.update({
      balance: newBalance,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id, balance: newBalance };
  },

  async remove(id) {
    const collection = getGLAccountCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  },

  // Initialize default tax GL accounts
  async initializeDefaultTaxAccounts() {
    const defaultAccounts = [
      {
        glCode: "2101",
        glAccountName: "VAT Output (VAT Payable)",
        accountType: "Liability",
        category: "Tax",
        usedWhen: "Sales Invoice",
        meaning: "VAT you collected from customers and owe to government",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "1301",
        glAccountName: "VAT Input (VAT Receivable)",
        accountType: "Asset",
        category: "Tax",
        usedWhen: "Purchase Bill",
        meaning: "VAT you paid to suppliers and can claim back",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "2102",
        glAccountName: "VAT Control Account",
        accountType: "Liability",
        category: "Tax",
        usedWhen: "VAT report time",
        meaning: "Net VAT to pay after input – output",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "2103",
        glAccountName: "Sales Tax Payable",
        accountType: "Liability",
        category: "Tax",
        usedWhen: "Sales Invoice",
        meaning: "Sales tax collected from customers",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "2104",
        glAccountName: "Excise Duty Payable",
        accountType: "Liability",
        category: "Tax",
        usedWhen: "Sales Invoice (Excise goods)",
        meaning: "Excise duty collected on alcohol, fuel, tobacco",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "1302",
        glAccountName: "Withholding Tax Receivable",
        accountType: "Asset",
        category: "Tax",
        usedWhen: "Payment to Supplier",
        meaning: "WHT withheld from supplier payments",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "2105",
        glAccountName: "Withholding Tax Payable",
        accountType: "Liability",
        category: "Tax",
        usedWhen: "Payment from Customer",
        meaning: "WHT withheld by customers",
        isActive: true,
        balance: 0,
      },
      {
        glCode: "1303",
        glAccountName: "Customs Duty Receivable",
        accountType: "Asset",
        category: "Tax",
        usedWhen: "Import Purchase",
        meaning: "Customs duty paid on imports",
        isActive: true,
        balance: 0,
      },
    ];

    const created = [];
    for (const account of defaultAccounts) {
      // Check if already exists
      const existing = await this.getByCode(account.glCode);
      if (!existing) {
        const result = await this.create(account);
        created.push(result);
      }
    }

    return created;
  },
};
