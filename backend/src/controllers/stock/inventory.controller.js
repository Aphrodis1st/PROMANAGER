import { ProductSettingModel } from "../../models/stock/productSetting.model.js";
import { PurchaseModel } from "../../models/stock/purchase.model.js";
import { SalesModel } from "../../models/stock/sales.model.js";

export const InventoryController = {
  // GET INVENTORY REPORT
  async getInventoryReport(req, res) {
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(date) : new Date();

      const products = await ProductSettingModel.getAll();
      const purchases = await PurchaseModel.findAll();
      const sales = await SalesModel.findAll();

      const inventoryData = products.map(product => {
        const openingStock = Number(product.openingStock) || 0;
        
        // Calculate purchases up to target date
        const purchasedQty = purchases
          .filter(p => {
            const pDate = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
            return p.productId === product.id && pDate <= targetDate;
          })
          .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
        
        // Calculate sales up to target date
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
        
        const closingStock = openingStock + purchasedQty - soldQty;
        
        return {
          id: product.id,
          name: product.name,
          category: product.productCategory || product.storeCategory,
          unit: product.unit,
          openingStock,
          purchasedQty,
          soldQty,
          closingStock,
          currentStock: product.currentStock || closingStock,
          reorderLevel: product.reorderLevel || 0,
          status: closingStock <= (product.reorderLevel || 0) ? 'Low Stock' : 'In Stock'
        };
      });

      return res.status(200).json(inventoryData);
    } catch (err) {
      console.error("Error generating inventory report:", err);
      return res.status(500).json({ error: "Failed to generate inventory report" });
    }
  },

  // UPDATE OPENING STOCK FOR NEW DAY
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
