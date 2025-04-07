import { create } from "zustand";

interface GroupState {
  groupName: string;
  selectedUsers: string[];
  setGroupName: (name: string) => void;
  setSelectedUsers: (userId: string) => void;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  groupName: "",
  selectedUsers: [],
  setGroupName: (name) => set({ groupName: name }),
  setSelectedUsers: (userId) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.includes(userId)
        ? state.selectedUsers.filter((id) => id !== userId)
        : [...state.selectedUsers, userId],
    })),
  reset: () => set({ groupName: "", selectedUsers: [] }),
}));
