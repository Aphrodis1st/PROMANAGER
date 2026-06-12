import { SalesModel } from "../../models/stock/sales.model.js";
import { ProductModel } from "../../models/stock/product.model.js";
import { ProductSettingModel } from "../../models/stock/productSetting.model.js";
import { InventoryValuationService } from "../../services/inventoryValuation.service.js";
import { ensureSaleJournal, postSaleJournal } from "../../services/stockSaleJournal.service.js";
import IncomeStatementModel from "../../models/stock/incomeStatement.model.js";

export const SalesController = {
  // CREATE SALE (Reduces Inventory - IAS 2 Compliant)
  async create(req, res) {
    try {
      console.log('📥 [SALES] Creating sale with data:', JSON.stringify(req.body, null, 2));
      
      const saleData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 [SALES] Sale data to save:', JSON.stringify(saleData, null, 2));
      
      const sale = await SalesModel.create(saleData);
      
      console.log('✅ [SALES] Sale created:', JSON.stringify(sale, null, 2));
      
      // ✅ REDUCE INVENTORY (IAS 2 - Inventory Recognition with FIFO/LIFO)
      const valuationMethod = req.body.valuationMethod || 'FIFO';
      const costDetails = [];
      
      if (sale.items && Array.isArray(sale.items)) {
        for (const item of sale.items) {
          if (item.productId && item.quantity) {
            console.log(`📉 [INVENTORY] Reducing stock for product ${item.productId} by ${item.quantity} using ${valuationMethod}`);
            try {
              const valuation = valuationMethod === 'LIFO' 
                ? await InventoryValuationService.consumeStockLIFO(item.productId, Number(item.quantity))
                : await InventoryValuationService.consumeStockFIFO(item.productId, Number(item.quantity));
              
              await ProductSettingModel.updateStock(item.productId, -Number(item.quantity));
              
              costDetails.push({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                costOfGoodsSold: valuation.totalCost,
                averageCost: valuation.averageCost,
              });
              
              console.log(`✅ [INVENTORY] Stock reduced for product ${item.productId}, COGS: ${valuation.totalCost}`);
            } catch (stockError) {
              console.error(`❌ [INVENTORY] Error reducing stock for product ${item.productId}:`, stockError);
              await SalesModel.remove(sale.id);
              return res.status(400).json({ error: `Insufficient stock for ${item.productName}: ${stockError.message}` });
            }
          }
        }
      } else if (sale.productId && sale.quantity) {
        console.log(`📉 [INVENTORY] Reducing stock for product ${sale.productId} by ${sale.quantity} using ${valuationMethod}`);
        try {
          const valuation = valuationMethod === 'LIFO'
            ? await InventoryValuationService.consumeStockLIFO(sale.productId, Number(sale.quantity))
            : await InventoryValuationService.consumeStockFIFO(sale.productId, Number(sale.quantity));
          
          await ProductSettingModel.updateStock(sale.productId, -Number(sale.quantity));
          
          costDetails.push({
            productId: sale.productId,
            quantity: sale.quantity,
            costOfGoodsSold: valuation.totalCost,
            averageCost: valuation.averageCost,
          });
          
          console.log(`✅ [INVENTORY] Stock reduced for product ${sale.productId}, COGS: ${valuation.totalCost}`);
        } catch (stockError) {
          console.error(`❌ [INVENTORY] Error reducing stock for product ${sale.productId}:`, stockError);
          await SalesModel.remove(sale.id);
          return res.status(400).json({ error: `Insufficient stock: ${stockError.message}` });
        }
      }
      
      const journalEntry = await postSaleJournal({
        sale,
        saleId: sale.id,
        sourceType: "sale",
        costDetails,
        userId: req.user?.id || null,
      });

      console.log('✅ [SALES] Sale completed successfully with inventory reduction');
      res.status(201).json({ 
        message: "Sale created successfully", 
        sale,
        journalEntryId: journalEntry?.id || null,
        costDetails,
        valuationMethod 
      });
    } catch (err) {
      console.error("❌ [SALES] Error creating sale:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // GET ALL SALES
  async getAll(req, res) {
    try {
      const sales = await SalesModel.findAll();
      res.json(sales);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async syncJournals(req, res) {
    try {
      const sales = await SalesModel.findAll();
      const results = [];

      for (const sale of sales) {
        if (!sale?.id || sale.status === "held" || sale.status === "recalled") {
          results.push({ saleId: sale?.id || null, skipped: true, reason: "not completed" });
          continue;
        }

        const sourceType = sale.cashierName || sale.cashierId || sale.paymentMethod
          ? "cashier"
          : "sale";

        const result = await ensureSaleJournal({
          sale,
          sourceType,
          userId: sale.userId || sale.cashierId || null,
        });

        results.push({
          saleId: sale.id,
          created: result.created,
          journalEntryId: result.journalEntry?.id || null,
        });
      }

      const incomeStatement = await IncomeStatementModel.generate({
        from: req.query.from || "2026-01-01",
        to: req.query.to || "2026-12-31",
        runId: req.query.runId || "gbma-profit-loss-2026",
      });

      res.json({
        message: "Sales journals synchronized",
        totalSales: sales.length,
        created: results.filter((item) => item.created).length,
        skipped: results.filter((item) => !item.created).length,
        results,
        incomeStatement,
      });
    } catch (err) {
      console.error("❌ [SALES] Error syncing sale journals:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // GET SALE BY ID
  async getById(req, res) {
    try {
      const sale = await SalesModel.findById(req.params.id);
      if (!sale) return res.status(404).json({ message: "Sale not found" });
      res.json(sale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE SALE
  async update(req, res) {
    try {
      const existingSale = await SalesModel.findById(req.params.id);
      if (!existingSale) return res.status(404).json({ message: "Sale not found" });

      const { productId, quantity, unitPrice, discount = 0, tax = 0 } = req.body;

      // Recalculate totals
      const subtotal = Number(quantity) * Number(unitPrice);
      const discountAmount = discount > 1 ? discount : subtotal * (discount / 100);
      const taxAmount = tax > 1 ? tax : subtotal * (tax / 100);
      const totalPrice = subtotal - discountAmount + taxAmount;

      const updatedSale = await SalesModel.update(req.params.id, {
        ...req.body,
        totalPrice,
        updatedAt: new Date().toISOString(),
      });

      // ✅ Find product in either model
      let product = await ProductModel.findById(productId);
      if (!product) {
        product = await ProductSettingModel.getById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
      }

      // ✅ Adjust stock only if product in ProductModel
      const qtyDiff = Number(existingSale.quantity) - Number(quantity);
      if (await ProductModel.findById(productId)) {
        await ProductModel.update(productId, { quantity: Number(product.quantity) + qtyDiff });
      }

      res.json({ message: "Sale updated and stock adjusted", sale: updatedSale });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE SALE
  async remove(req, res) {
    try {
      const sale = await SalesModel.findById(req.params.id);
      if (!sale) return res.status(404).json({ message: "Sale not found" });

      await SalesModel.remove(req.params.id);
      res.json({ message: "Sale deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
