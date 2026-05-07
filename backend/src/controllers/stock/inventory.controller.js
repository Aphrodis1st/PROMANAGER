import { ProductSettingModel } from "../../models/stock/productSetting.model.js";
import { PurchaseModel } from "../../models/stock/purchase.model.js";
import { SalesModel } from "../../models/stock/sales.model.js";
import { FinishedGoodModel } from "../../models/production/finishedGood.model.js";
import { InventoryLedgerModel } from "../../models/stock/inventoryLedger.model.js";
import { InventoryValuationService } from "../../services/inventoryValuation.service.js";

export const InventoryController = {
  async getInventoryReport(req, res) {
    try {
      const { date, valuationMethod = 'FIFO' } = req.query;
      const targetDate = date ? new Date(date) : new Date();

      const products = await ProductSettingModel.getAll();
      const purchases = await PurchaseModel.findAll();
      const sales = await SalesModel.findAll();
      const finishedGoods = await FinishedGoodModel.findAll();

      const inventoryData = await Promise.all(products.map(async product => {
        const openingStock = Number(product.openingStock) || 0;
        
        const purchasedQty = purchases
          .filter(p => {
            const pDate = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
            return p.productId === product.id && pDate <= targetDate;
          })
          .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
        
        const productionQty = finishedGoods
          .filter(fg => {
            const fgDate = fg.createdAt?.toDate ? fg.createdAt.toDate() : new Date(fg.createdAt);
            return fg.productId === product.id && 
                   fg.addedToInventory === true && 
                   fgDate <= targetDate;
          })
          .reduce((sum, fg) => sum + (Number(fg.quantityProduced) || 0), 0);
        
        const soldQty = sales
          .filter(s => {
            const sDate = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
            if (s.items && Array.isArray(s.items)) {
              return s.items.some(item => item.productId === product.id) && sDate <= targetDate;
            }
            return s.productId === product.id && sDate <= targetDate;
          })
          .reduce((sum, s) => {
            if (s.items && Array.isArray(s.items)) {
              const item = s.items.find(i => i.productId === product.id);
              return sum + (Number(item?.quantity) || 0);
            }
            return sum + (Number(s.quantity) || 0);
          }, 0);
        
        const currentStock = Number(product.currentStock) || 0;
        
        // Get inventory value using FIFO or LIFO
        let stockValue = 0;
        let averageCost = Number(product.defaultBuyingPrice) || 0;
        
        try {
          const valuation = valuationMethod === 'LIFO'
            ? await InventoryValuationService.getInventoryValueLIFO(product.id)
            : await InventoryValuationService.getInventoryValueFIFO(product.id);
          
          stockValue = valuation.value;
          averageCost = valuation.averageCost || averageCost;
        } catch (error) {
          stockValue = currentStock * averageCost;
        }
        
        return {
          id: product.id,
          name: product.name,
          category: product.productCategory || product.storeCategory,
          productCategory: product.productCategory,
          storeCategory: product.storeCategory,
          unit: product.unit,
          openingStock,
          purchasedQty,
          productionQty,
          soldQty,
          closingStock: currentStock,
          currentStock,
          reorderLevel: product.reorderLevel || 0,
          unitPrice: averageCost,
          openingValue: openingStock * averageCost,
          closingValue: stockValue,
          valuationMethod,
          status: currentStock <= (product.reorderLevel || 0) ? 'Low Stock' : 'In Stock'
        };
      }));

      return res.status(200).json(inventoryData);
    } catch (err) {
      console.error("Error generating inventory report:", err);
      return res.status(500).json({ error: "Failed to generate inventory report" });
    }
  },

  async updateOpeningStocks(req, res) {
    try {
      const products = await ProductSettingModel.getAll();
      
      for (const product of products) {
        const currentStock = Number(product.currentStock) || 0;
        await ProductSettingModel.update(product.id, {
          openingStock: currentStock
        });
      }

      return res.status(200).json({ message: "Opening stocks updated successfully" });
    } catch (err) {
      console.error("Error updating opening stocks:", err);
      return res.status(500).json({ error: "Failed to update opening stocks" });
    }
  }
};
