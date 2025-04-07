import { create } from 'zustand';
import { IUser } from '../../../backend/src/interfaces/user.interface';


interface UserState {
  users: IUser[];
  addUser: (user: IUser) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}));

