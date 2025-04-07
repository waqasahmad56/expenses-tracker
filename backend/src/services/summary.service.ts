import mongoose from "mongoose";
import Expense from "../models/expense.model";
import { IExpense } from "../interfaces/expense.interface";

const getSummary = async (groupId: string): Promise<IExpense[]> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw new Error("Invalid Group ID format");
    }

    const expenses = await Expense.find({ groupId: new mongoose.Types.ObjectId(groupId) }).lean();

    const formattedExpenses: IExpense[] = expenses.map((exp) => ({
      id: exp._id?.toString() || "",
      groupId: exp.groupId?.toString() || "",
      payerId: exp.payerId?.toString() || "",
      description: exp.description || "No Description",
      amount: exp.amount || 0,
      splitAmount:
        exp.splitAmount?.map((entry: any) => ({
          userId: entry.userId?.toString() || "",
          amountOwed: entry.amountOwed || 0,
        })) || [],
      createdAt: exp.createdAt || new Date(),
    }));

    return formattedExpenses;
  } catch (error) {
    console.error(" Error in getSummary:", error);
    throw new Error("Failed to fetch summary");
  }
};

export default { getSummary };
