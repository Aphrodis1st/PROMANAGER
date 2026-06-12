import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getJournalCollection = () => db().collection("journalEntries");
const getAccountSettingsCollection = () => db().collection("accountSettings");
const getAccountsCollection = () => db().collection("accounts");
const getGLAccountsCollection = () => db().collection("glAccounts");
const getIncomeCollection = () => db().collection("incomeStatements");

const loadAccounts = async () => {
  const [settingsSnap, accountsSnap, glAccountsSnap] = await Promise.all([
    getAccountSettingsCollection().get(),
    getAccountsCollection().get(),
    getGLAccountsCollection().get(),
  ]);
  const byId = new Map();
  settingsSnap.docs.forEach(d => byId.set(d.id, { id: d.id, ...d.data() }));
  accountsSnap.docs.forEach(d => byId.set(d.id, { id: d.id, ...d.data() }));
  glAccountsSnap.docs.forEach(d => byId.set(d.id, { id: d.id, ...d.data() }));
  return Array.from(byId.values());
};

const accountName = (account, fallback = "") =>
  account?.name ||
  account?.accountName ||
  account?.glAccountName ||
  account?.title ||
  fallback;

const accountCode = (account) =>
  account?.code ||
  account?.accountCode ||
  account?.glCode ||
  "";

const lineDebit = (line) => {
  if (line?.type === "debit") return Number(line.amount || line.debit || 0);
  return Number(line?.debit || 0);
};

const lineCredit = (line) => {
  if (line?.type === "credit") return Number(line.amount || line.credit || 0);
  return Number(line?.credit || 0);
};

const lineAmount = (line) => Number(line?.amount || lineDebit(line) || lineCredit(line) || 0);

const isDebitLine = (line) => lineDebit(line) > 0;
const isCreditLine = (line) => lineCredit(line) > 0;

const normalizeStatementType = (account) => {
  const values = [
    account?.statement,
    account?.category,
    account?.type,
    account?.accountType,
    account?.subCategory,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  if (values.some((value) => value.includes("revenue") || value.includes("income"))) return "revenue";
  if (values.some((value) => value.includes("expense") || value.includes("cost"))) return "expense";
  return "";
};

const inferStatementTypeFromName = (name = "") => {
  const value = String(name).toLowerCase();
  if (/revenue|sales|income|turnover|commission|grant|donation/.test(value)) return "revenue";
  if (/expense|cost|cogs|salary|wage|rent|utilities|insurance|maintenance|depreciation|tax|fee|freight|purchase/.test(value)) return "expense";
  return "";
};

const isProductSalesRevenueLine = (entry, line, lineName, acctCategory) => {
  if (acctCategory !== "revenue") return false;

  const sourceType = String(entry?.source?.type || "").toLowerCase();
  const text = [
    lineName,
    line?.accountName,
    line?.description,
    entry?.description,
    entry?.reference,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    ["sale", "sales", "cashier", "pos"].includes(sourceType) ||
    /product sales|sales revenue|sale|sales|invoice|pos|cashier/.test(text)
  );
};

const isPurchaseLine = (entry, line, lineName) => {
  const sourceType = String(entry?.source?.type || entry?.type || "").toLowerCase();
  const text = [
    lineName,
    line?.accountName,
    line?.description,
    entry?.description,
    entry?.reference,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    isDebitLine(line) &&
    ["purchase", "supplierinvoice", "supplier_invoice"].includes(sourceType) &&
    /(inventory|stock|finished goods|raw material|raw materials)/.test(text) &&
    !/(vat|tax|receivable|payable)/.test(text)
  );
};

const IncomeStatementModel = {
  // Build income statement for given date range (inclusive)
  async generate({ from = null, to = null, runId = `run-${Date.now()}` } = {}) {
    const journalCollection = getJournalCollection();
    const incomeCollection = getIncomeCollection();
    
    // load accounts metadata
    const accounts = await loadAccounts();

    const accountsById = new Map();
    accounts.forEach(account => {
      accountsById.set(account.id, account);
      const code = accountCode(account);
      if (code) accountsById.set(String(code), account);
    });

    // fetch journal entries in range
    let query = journalCollection;
    if (from) query = query.where("date", ">=", from);
    if (to) query = query.where("date", "<=", to);
    const jSnap = await query.get();
    const journals = jSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const totals = {
      revenue: 0,
      expenses: 0,
      revenueByAccount: {},
      expenseByAccount: {},
    };

    journals.forEach(entry => {
      (entry.lines || []).forEach(line => {
        const acctMeta = accountsById.get(line.accountId) || {};
        const lineName = line.accountName || accountName(acctMeta, line.accountId);
        const acctCategory = normalizeStatementType(acctMeta) || inferStatementTypeFromName(lineName);
        const isProductSales = isProductSalesRevenueLine(entry, line, lineName, acctCategory);
        const reportAccountId = isProductSales ? "product-sales-revenue" : line.accountId;
        const reportAccountName = isProductSales ? "Product Sales Revenue" : lineName;
        const isPurchase = isPurchaseLine(entry, line, lineName);

        if (isPurchase) {
          const amount = lineAmount(line);
          totals.expenses += amount;
          totals.expenseByAccount.purchases = totals.expenseByAccount.purchases || { amount: 0, accountName: "Purchases" };
          totals.expenseByAccount.purchases.amount += amount;
          return;
        }

        if (isCreditLine(line) && acctCategory === "revenue") {
          const amount = lineCredit(line);
          totals.revenue += amount;
          totals.revenueByAccount[reportAccountId] = totals.revenueByAccount[reportAccountId] || { amount: 0, accountName: reportAccountName };
          totals.revenueByAccount[reportAccountId].amount += amount;
        }
        if (isDebitLine(line) && acctCategory === "revenue") {
          // contra or refund - treat as negative revenue
          const amount = lineDebit(line);
          totals.revenue -= amount;
          totals.revenueByAccount[reportAccountId] = totals.revenueByAccount[reportAccountId] || { amount: 0, accountName: reportAccountName };
          totals.revenueByAccount[reportAccountId].amount -= amount;
        }

        if (isDebitLine(line) && acctCategory === "expense") {
          const amount = lineDebit(line);
          totals.expenses += amount;
          totals.expenseByAccount[line.accountId] = totals.expenseByAccount[line.accountId] || { amount: 0, accountName: lineName };
          totals.expenseByAccount[line.accountId].amount += amount;
        }
        if (isCreditLine(line) && acctCategory === "expense") {
          // contra expense or reversal
          const amount = lineCredit(line);
          totals.expenses -= amount;
          totals.expenseByAccount[line.accountId] = totals.expenseByAccount[line.accountId] || { amount: 0, accountName: lineName };
          totals.expenseByAccount[line.accountId].amount -= amount;
        }
      });
    });

    const netIncome = totals.revenue - totals.expenses;
    const rows = [
      ...Object.entries(totals.revenueByAccount).map(([accountId, value]) => {
        const account = accountsById.get(accountId) || {};
        return {
          accountId,
          accountCode: accountCode(account),
          accountName: accountName(account, value.accountName || accountId),
          amount: Number(value.amount || 0),
          type: "revenue",
          category: account?.category || account?.subCategory || account?.accountType || "",
        };
      }),
      ...Object.entries(totals.expenseByAccount).map(([accountId, value]) => {
        const account = accountsById.get(accountId) || {};
        return {
          accountId,
          accountCode: accountCode(account),
          accountName: accountName(account, value.accountName || accountId),
          amount: Number(value.amount || 0),
          type: "expense",
          category: account?.category || account?.subCategory || account?.accountType || "",
        };
      }),
    ];

    const snapshot = {
      runId,
      from,
      to,
      generatedAt: new Date().toISOString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      totals,
      rows,
      netIncome,
    };

    await incomeCollection.doc(runId).set(snapshot);
    return { id: runId, ...snapshot };
  },

  async getSnapshot(runId = null) {
    const incomeCollection = getIncomeCollection();
    
    if (runId) {
      const doc = await incomeCollection.doc(runId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }
    const snap = await incomeCollection.orderBy("createdAt", "desc").limit(1).get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  async removeSnapshot(runId) {
    const incomeCollection = getIncomeCollection();
    await incomeCollection.doc(runId).delete();
    return true;
  },
};

export default IncomeStatementModel;
