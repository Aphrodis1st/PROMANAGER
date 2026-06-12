import express from "express";
import { AccountController } from "../../controllers/stock/accounts.controller.js";

const router = express.Router();

// Seed default accounts
router.post("/seed", AccountController.seedDefault);

// Create account
router.post("/", AccountController.create);

// Get all accounts
router.get("/", AccountController.getAll);

// Get account by ID
router.get("/:id", AccountController.getById);

// Update account
router.put("/:id", AccountController.update);

// Delete account
router.delete("/:id", AccountController.remove);

export default router;
