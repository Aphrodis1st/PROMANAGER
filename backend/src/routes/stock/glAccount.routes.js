import express from "express";
import { GLAccountController } from "../../controllers/stock/glAccount.controller.js";
import { stockAuth } from "../../middleware/stock/auth.js";

const router = express.Router();

// GL Account Routes
router.post("/", stockAuth, GLAccountController.createGLAccount);
router.get("/", stockAuth, GLAccountController.getAllGLAccounts);
router.get("/code/:code", stockAuth, GLAccountController.getGLAccountByCode);
router.get("/:id", stockAuth, GLAccountController.getGLAccountById);
router.put("/:id", stockAuth, GLAccountController.updateGLAccount);
router.delete("/:id", stockAuth, GLAccountController.deleteGLAccount);
router.post("/initialize-defaults", stockAuth, GLAccountController.initializeDefaultAccounts);
router.put("/:id/balance", stockAuth, GLAccountController.updateBalance);

export default router;
