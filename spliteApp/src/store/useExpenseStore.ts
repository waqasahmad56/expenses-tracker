import { create } from 'zustand';

interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IGroup {
  _id: string;
  name: string;
  users: IUser[];
  createdAt: string;
  updatedAt: string;
}

interface ExpenseState {
  selectedGroup: IGroup | null;
  payer: string;
  description: string;
  amount: number;
  splitAmong: string[];
  splitAmounts: { userId: string; amountOwed: number }[];

  setSelectedGroup: (group: IGroup | null) => void;
  setPayer: (payerId: string) => void;
  setDescription: (desc: string) => void;
  setAmount: (amt: number) => void;
  setSplitAmong: (userIds: string[]) => void;
  calculateSplitAmounts: () => void;
  resetForm: () => void;
}

const useExpenseStore = create<ExpenseState>((set, get) => ({
  selectedGroup: null,
  payer: '',
  description: '',
  amount: 0,
  splitAmong: [],
  splitAmounts: [],

  setSelectedGroup: (group) =>
    set({
      selectedGroup: group,
      payer: '',
      splitAmong: [],
      splitAmounts: [],
    }),

  setPayer: (payerId) => set({ payer: payerId }),
  setDescription: (desc) => set({ description: desc }),
  setAmount: (amt) => {
    set({ amount: amt });
    get().calculateSplitAmounts();
  },
  setSplitAmong: (userIds) => {
    set({ splitAmong: userIds });
    get().calculateSplitAmounts();
  },
  calculateSplitAmounts: () => {
    const { amount, splitAmong } = get();
    if (amount > 0 && splitAmong.length > 0) {
      const dividedAmount = Number((amount / splitAmong.length).toFixed(2));
      set({ splitAmounts: splitAmong.map(userId => ({ userId, amountOwed: dividedAmount })) });
    } else {
      set({ splitAmounts: [] });
    }
  },
  resetForm: () =>
    set({
      selectedGroup: null,
      payer: '',
      description: '',
      amount: 0,
      splitAmong: [],
      splitAmounts: [],
    }),
}));

export default useExpenseStore;
