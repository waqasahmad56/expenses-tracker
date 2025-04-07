import { create } from "zustand";

interface ModalState {
  isCreateGroupOpen: boolean;
  isAddMembersOpen: boolean;
  isAddExpenseOpen: boolean;
  openCreateGroup: () => void;
  closeCreateGroup: () => void;
  openAddMembers: () => void;
  closeAddMembers: () => void;
  openAddExpense: () => void;
  closeAddExpense: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateGroupOpen: false,
  isAddMembersOpen: false,
  isAddExpenseOpen: false,
  openCreateGroup: () => set({ isCreateGroupOpen: true }),
  closeCreateGroup: () => set({ isCreateGroupOpen: false }),
  openAddMembers: () => set({ isAddMembersOpen: true }),
  closeAddMembers: () => set({ isAddMembersOpen: false }),
  openAddExpense: () => set({ isAddExpenseOpen: true }),
  closeAddExpense: () => set({ isAddExpenseOpen: false }),
}));
