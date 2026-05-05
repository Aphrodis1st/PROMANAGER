import React, { createContext, useContext, useState, useEffect } from "react";
import {
  stockService,
  backendProductSettingsService,
  accountSettingsService,
} from "../services/stock.service";
import { PurchaseProvider, usePurchase } from "./PurchaseContext";
import { SalesProvider, useSales } from "./SalesContext";
import { ReportProvider } from "./ReportContext";
import { PaymentProvider, usePayment } from "./PaymentContext";

const StockContext = createContext();

const StockProviderCore = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [dispenses, setDispenses] = useState([]);
  const [assets, setAssets] = useState([]);
  const [productSettings, setProductSettings] = useState([]);
  const [accountSettings, setAccountSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  const purchaseContext = usePurchase();
  const salesContext = useSales();
  const paymentContext = usePayment();

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [
          stockResRaw,
          productSettingsResRaw,
          accountSettingsResRaw,
          fixedAssetsResRaw,
          productsResRaw,
          suppliersResRaw,
          invoicesResRaw,
          customersResRaw,
          paymentsResRaw,
        ] = await Promise.allSettled([
          stockService.getAll(),
          backendProductSettingsService.getAll(),
          accountSettingsService.getAll(),
          stockService.getAll("fixed-assets"),
          stockService.getAll("products"),
          stockService.getAll("supplier"),
          stockService.getAll("invoice"),
          stockService.getAll("customer"),
          stockService.getAll("payment"),
        ]);

        const stockRes = stockResRaw.status === "fulfilled" ? stockResRaw.value : {};
        const productSettingsRes =
          productSettingsResRaw.status === "fulfilled" &&
          Array.isArray(productSettingsResRaw.value)
            ? productSettingsResRaw.value
            : [];
        const accountSettingsRes =
          accountSettingsResRaw.status === "fulfilled"
            ? Array.isArray(accountSettingsResRaw.value)
              ? accountSettingsResRaw.value
              : accountSettingsResRaw.value?.data ||
                accountSettingsResRaw.value?.accounts ||
                []
            : [];

        const fixedAssetsRes =
          fixedAssetsResRaw.status === "fulfilled"
            ? Array.isArray(fixedAssetsResRaw.value)
              ? fixedAssetsResRaw.value
              : fixedAssetsResRaw.value?.data || []
            : [];

        const productsRaw =
          productsResRaw.status === "fulfilled"
            ? Array.isArray(productsResRaw.value)
              ? productsResRaw.value
              : productsResRaw.value?.data || []
            : [];

        const normalizedProducts = productsRaw.map((p) => ({
          id: p.id,
          name: p.name || "-",
          category: p.category || "General",
          unit: p.unit || "-",
          buyingPrice: Number(p.costPrice) || 0,
          sellingPrice: Number(p.sellingPrice) || 0,
          quantity: Number(p.currentStock) || 0,
          supplier: p.supplier || "-",
          expiryDate: p.expiryDate || "-",
          barcode: p.barcode || "",
          description: p.description || "",
          status: p.status || "active",
        }));
        setProducts(normalizedProducts);

        const suppliersRaw =
          suppliersResRaw.status === "fulfilled" &&
          Array.isArray(suppliersResRaw.value)
            ? suppliersResRaw.value
            : [];
        const normalizedSuppliers = suppliersRaw.map((s) => ({
          id: s.id,
          name: s.name || "-",
          phone: s.phone || "-",
          email: s.email || "-",
          address: s.address || "-",
          status: s.status || "active",
        }));
        purchaseContext.setSuppliers(normalizedSuppliers);

        const customersRaw =
          customersResRaw.status === "fulfilled" &&
          Array.isArray(customersResRaw.value)
            ? customersResRaw.value
            : [];
        const normalizedCustomers = customersRaw.map((c) => ({
          id: c.id,
          name: c.name || "-",
          phone: c.phone || "-",
          email: c.email || "-",
          address: c.address || "-",
          status: c.status || "active",
        }));
        salesContext.setCustomers(normalizedCustomers);

        const invoicesRaw =
          invoicesResRaw.status === "fulfilled" &&
          Array.isArray(invoicesResRaw.value)
            ? invoicesResRaw.value
            : [];
        const normalizedInvoices = invoicesRaw.map((inv) => ({
          id: inv.id,
          number: inv.number || "-",
          type: inv.type || "sale",
          customerId: inv.customerId || "",
          supplierId: inv.supplierId || "",
          date: inv.date || "-",
          items: Array.isArray(inv.items)
            ? inv.items.map((item) => ({
                productId: item.productId || "",
                productName: item.productName || "-",
                description: item.description || "",
                quantity: Number(item.quantity) || 0,
                unit: item.unit || "-",
                unitPrice: Number(item.unitPrice) || 0,
                discount: Number(item.discount) || 0,
                tax: Number(item.tax) || 0,
                total: Number(item.total) || 0,
                batchNo: item.batchNo || "",
                expiry: item.expiry || "",
                quality: item.quality || "",
                warranty: item.warranty || "",
                serialNo: item.serialNo || "",
                storeLocation: item.storeLocation || "-",
                storeCategory: item.storeCategory || "-",
                inventoryAccount: item.inventoryAccount || "-",
                inventoryAccountId: item.inventoryAccountId || "",
                type: item.type || "Product",
                openingStock: Number(item.openingStock) || 0,
              }))
            : [],
          totalAmount: Number(inv.totalAmount) || 0,
          status: inv.status || "pending",
        }));
        purchaseContext.setInvoices(normalizedInvoices);

        const paymentsRaw =
          paymentsResRaw.status === "fulfilled" &&
          Array.isArray(paymentsResRaw.value)
            ? paymentsResRaw.value
            : [];
        const normalizedPayments = paymentsRaw.map((p) => ({
          id: p.id,
          date: p.date || new Date().toISOString(),
          amount: Number(p.amount) || 0,
          paymentType: p.paymentType || "supplier",
          relatedId: p.relatedId || "",
          method: p.method || "cash",
          reference: p.reference || "-",
          description: p.description || "",
          status: p.status || "completed",
        }));
        paymentContext.setPayments(normalizedPayments);

        purchaseContext.setPurchases(
          stockRes.purchases && Array.isArray(stockRes.purchases)
            ? stockRes.purchases
            : []
        );

        const salesRaw = stockRes.sales && Array.isArray(stockRes.sales) ? stockRes.sales : [];
        const normalizedSales = salesRaw.map((sale) => ({
          ...sale,
          items: Array.isArray(sale.items)
            ? sale.items.map((item) => ({
                productId: item.productId || '',
                productName: item.productName || '',
                description: item.description || '',
                quantity: Number(item.quantity) || 0,
                unit: item.unit || '',
                unitPrice: Number(item.unitPrice) || 0,
                discount: Number(item.discount) || 0,
                tax: Number(item.tax) || 0,
                totalPrice: Number(item.totalPrice) || Number(item.total) || 0,
                batchNumber: item.batchNumber || '',
                expirationDate: item.expirationDate || '',
                qualityGrade: item.qualityGrade || '',
                warranty: item.warranty || '',
                serialNumber: item.serialNumber || '',
                storeLocation: item.storeLocation || '',
                productCategory: item.productCategory || '',
              }))
            : [],
          totalPrice: Number(sale.totalPrice) || 0,
        }));
        
        console.log('✅ Normalized sales:', normalizedSales);
        salesContext.setSales(normalizedSales);

        setDispenses(
          stockRes.dispenses && Array.isArray(stockRes.dispenses)
            ? stockRes.dispenses
            : []
        );

        setAccountSettings(accountSettingsRes);

        const inventoryAccounts = accountSettingsRes.filter(
          (acc) =>
            acc.type === "Assets" &&
            acc.category === "Current Assets" &&
            acc.name?.toLowerCase().includes("inventory")
        );

        const productsWithInventory = productSettingsRes.map((p) => ({
          ...p,
          inventoryAccountId:
            p.inventoryAccountId || inventoryAccounts[0]?.id || "",
        }));
        setProductSettings(productsWithInventory);

        setAssets(
          fixedAssetsRes.map((a) => ({
            id: a.id,
            assetName: a.assetName || a.name || "-",
            cost: Number(a.cost) || 0,
            usefulLife: Number(a.usefulLife) || 5,
            acquisitionDate: a.acquisitionDate || "-",
            accountId: a.accountId || a.purchaseAccountId || "",
            accountName:
              a.accountName ||
              a.purchaseAccountName ||
              (a.account && a.account.name) ||
              "-",
            paymentAccountId: a.paymentAccountId || null,
            paymentAccountName: a.paymentAccountName || null,
            accumulatedDepreciation: Number(a.accumulatedDepreciation) || 0,
            currency: a.currency || "RWF",
          }))
        );
      } catch (err) {
        console.error("❌ Error loading stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const addProduct = async (data) => {
    const newProduct = await stockService.add("products", data);
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id, data) => {
    const updated = await stockService.update("products", id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id) => {
    await stockService.remove("products", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addAccount = async (data) => {
    await accountSettingsService.create(data);
    const updated = await accountSettingsService.getAll();
    setAccountSettings(updated);
  };

  const updateAccount = async (id, data) => {
    await accountSettingsService.update(id, data);
    const updated = await accountSettingsService.getAll();
    setAccountSettings(updated);
  };

  const deleteAccount = async (id) => {
    await accountSettingsService.remove(id);
    const updated = await accountSettingsService.getAll();
    setAccountSettings(updated);
  };

  const addProductSetting = async (data) => {
    const created = await backendProductSettingsService.create(data);
    const updated = await backendProductSettingsService.getAll();
    setProductSettings(updated);
    return created;
  };

  const updateProductSetting = async (id, data) => {
    await backendProductSettingsService.update(id, data);
    const updated = await backendProductSettingsService.getAll();
    setProductSettings(updated);
  };

  const deleteProductSetting = async (id) => {
    await backendProductSettingsService.remove(id);
    const updated = await backendProductSettingsService.getAll();
    setProductSettings(updated);
  };

  const addDispense = async (data) => {
    const saved = await stockService.add("dispense", data);
    setDispenses((prev) => [...prev, saved]);
    return saved;
  };

  const addFixedAsset = async (data) => {
    const response = await stockService.add("fixed-assets", data);
    const savedAsset = response?.data?.asset || response?.asset || null;

    if (savedAsset) {
      const normalized = {
        id: savedAsset.id,
        assetName: savedAsset.assetName || savedAsset.name || "-",
        cost: Number(savedAsset.cost) || 0,
        usefulLife: Number(savedAsset.usefulLife) || 5,
        acquisitionDate: savedAsset.acquisitionDate || "-",
        accountId: savedAsset.purchaseAccountId || "",
        accountName: savedAsset.purchaseAccountName || "-",
        paymentAccountId: savedAsset.paymentAccountId || null,
        paymentAccountName: savedAsset.paymentAccountName || null,
        accumulatedDepreciation: Number(savedAsset.accumulatedDepreciation) || 0,
        currency: savedAsset.currency || "RWF",
      };
      setAssets((prev) => [normalized, ...prev]);
    }

    return savedAsset;
  };

  const getProductStock = (productId) => {
    if (!productId) return 0;

    const purchased = (purchaseContext.purchases || [])
      .filter((p) => p.productId === productId)
      .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);

    const sold = (salesContext.sales || [])
      .filter((s) => s.productId === productId)
      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

    const dispensed = (dispenses || [])
      .filter((d) => d.productId === productId)
      .reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);

    const stock = purchased - sold - dispensed;
    return stock > 0 ? stock : 0;
  };

  const getProductTotalPrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;
    const stockQty = getProductStock(productId);
    return stockQty * (Number(product.buyingPrice) || 0);
  };

  const getTotalClosingStockValue = () => {
    return products.reduce((sum, p) => {
      const closingQty = getProductStock(p.id);
      return sum + closingQty * (Number(p.buyingPrice) || 0);
    }, 0);
  };

  const getById = async (type, id) => {
    if (!type || !id) throw new Error("Missing type or id in getById()");
    try {
      return await stockService.getById(type, id);
    } catch (error) {
      console.error(`❌ Error fetching ${type} by id (${id}):`, error);
      throw error;
    }
  };

  return (
    <StockContext.Provider
      value={{
        products,
        dispenses,
        assets,
        productSettings,
        accountSettings,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addAccount,
        updateAccount,
        deleteAccount,
        addProductSetting,
        updateProductSetting,
        deleteProductSetting,
        addDispense,
        addFixedAsset,
        getProductStock,
        getProductTotalPrice,
        getTotalClosingStockValue,
        getById,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const StockProvider = ({ children }) => {
  const [accountSettings, setAccountSettings] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await accountSettingsService.getAll();
        const accounts = Array.isArray(res) ? res : res?.data || res?.accounts || [];
        setAccountSettings(accounts);
      } catch (err) {
        console.error("❌ Error loading accounts:", err);
      }
    };
    loadAccounts();
  }, []);

  return (
    <PurchaseProvider accountSettings={accountSettings}>
      <SalesProvider>
        <PaymentProvider accountSettings={accountSettings} updateInvoice={null}>
          <StockProviderCore>
            <ReportProvider products={[]} purchases={[]} sales={[]} invoices={[]}>
              {children}
            </ReportProvider>
          </StockProviderCore>
        </PaymentProvider>
      </SalesProvider>
    </PurchaseProvider>
  );
};

export const useStock = () => useContext(StockContext);
