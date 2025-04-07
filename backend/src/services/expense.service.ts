import Expense from "../models/expense.model";
import { IExpense } from "../interfaces/expense.interface";

export const addExpense = async (expenseData: Omit<IExpense, "_id">) => {
  return await Expense.create(expenseData);
};

export const getGroupExpenses = async (groupId: string) => {
  return await Expense.find({ groupId });
};
