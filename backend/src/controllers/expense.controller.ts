import { Request, Response } from "express";
import * as expenseService from "../services/expense.service";

export const addExpenseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupId, payerId, description, amount, splitAmount } = req.body;

    if (!groupId || !payerId || !description || !amount || !splitAmount || !Array.isArray(splitAmount)) {
      res.status(400).json({ message: "Invalid request data" });
      return;
    }

    const formattedSplitAmount = splitAmount.map((entry: { userId: string; amountOwed: number }) => ({
      userId: entry.userId,
      amountOwed: entry.amountOwed,
    }));

    const newExpense = await expenseService.addExpense({
      groupId,
      payerId,
      description,
      amount,
      splitAmount: formattedSplitAmount,
      createdAt: new Date(),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(" Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error });
  }
};

export const getExpensesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      res.status(400).json({ message: "Group ID is required" });
      return;
    }

    const expenses = await expenseService.getGroupExpenses(groupId);
    res.status(200).json(expenses);
  } catch (error) {
    console.error(" Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};
