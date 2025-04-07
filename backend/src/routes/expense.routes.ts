import { Router } from "express";
import { addExpenseController, getExpensesController } from "../controllers/expense.controller";

const router = Router();

router.post("/addexp", addExpenseController);
router.get("/:groupId", getExpensesController);

export default router;
