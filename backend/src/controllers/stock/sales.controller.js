import { SalesModel } from "../../models/stock/sales.model.js";
import { ProductModel } from "../../models/stock/product.model.js";
import { ProductSettingModel } from "../../models/stock/productSetting.model.js";

export const SalesController = {
  // CREATE SALE
  async create(req, res) {
    try {
      console.log('📥 Creating sale with data:', JSON.stringify(req.body, null, 2));
      
      const saleData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 Sale data to save:', JSON.stringify(saleData, null, 2));
      
      const sale = await SalesModel.create(saleData);
      
      console.log('✅ Sale created:', JSON.stringify(sale, null, 2));
      
      // Update product stock (reduce)
      if (sale.items && Array.isArray(sale.items)) {
        for (const item of sale.items) {
          if (item.productId && item.quantity) {
            console.log(`📉 Reducing stock for product ${item.productId} by ${item.quantity}`);
            try {
              await ProductSettingModel.updateStock(item.productId, -Number(item.quantity));
              console.log(`✅ Stock updated for product ${item.productId}`);
            } catch (stockError) {
              console.error(`❌ Error updating stock for product ${item.productId}:`, stockError);
            }
          }
        }
      } else if (sale.productId && sale.quantity) {
        console.log(`📉 Reducing stock for product ${sale.productId} by ${sale.quantity}`);
        try {
          await ProductSettingModel.updateStock(sale.productId, -Number(sale.quantity));
          console.log(`✅ Stock updated for product ${sale.productId}`);
        } catch (stockError) {
          console.error(`❌ Error updating stock for product ${sale.productId}:`, stockError);
        }
      }
      
      res.status(201).json({ message: "Sale created successfully", sale });
    } catch (err) {
      console.error("❌ Error creating sale:", err);
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
