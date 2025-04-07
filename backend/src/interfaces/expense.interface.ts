export interface IExpense {
  _id?: string;
  groupId: string;
  payerId: string;
  description: string;
  amount: number;
  splitAmount: {
    userId: string;
    amountOwed: number;
  }[];
  createdAt?: Date;
}
