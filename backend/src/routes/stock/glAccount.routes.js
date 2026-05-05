import express from "express";
import { GLAccountController } from "../../controllers/stock/glAccount.controller.js";
import { requireAuth } from "../../middleware/stock/auth.js";

const router = express.Router();

// GL Account Routes
router.post("/", requireAuth, GLAccountController.createGLAccount);
router.get("/", requireAuth, GLAccountController.getAllGLAccounts);
router.get("/code/:code", requireAuth, GLAccountController.getGLAccountByCode);
router.get("/:id", requireAuth, GLAccountController.getGLAccountById);
router.put("/:id", requireAuth, GLAccountController.updateGLAccount);
router.delete("/:id", requireAuth, GLAccountController.deleteGLAccount);
router.post("/initialize-defaults", requireAuth, GLAccountController.initializeDefaultAccounts);
router.put("/:id/balance", requireAuth, GLAccountController.updateBalance);

export default router;
