import express from "express";
import { ExpenseController } from "../../controllers/stock/expenses.controller.js";

const router = express.Router();

// POST /api/expenses -> Create expense (with auto journal entry)
router.post("/", ExpenseController.create);

// GET /api/expenses -> Fetch all expenses
router.get("/", ExpenseController.getAll);

// GET /api/expenses/:id -> Fetch expense by ID
router.get("/:id", ExpenseController.getById);

// PUT /api/expenses/:id -> Update expense
router.put("/:id", ExpenseController.update);

// DELETE /api/expenses/:id -> Delete expense + linked journal
router.delete("/:id", ExpenseController.remove);

export default router;
