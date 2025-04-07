import mongoose, { Schema, Document } from 'mongoose';
import { IExpense } from '../interfaces/expense.interface';

export interface IExpenseDocument extends Document, Omit<IExpense, '_id'> {}

const ExpenseSchema: Schema = new Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description:{type:String,required:true},
    amount: { type: Number, required: true },
    splitAmount: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amountOwed: { type: Number, required: true },
      }
    ],  },

  { timestamps: true }
);

const Expense = mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);
export default Expense;
