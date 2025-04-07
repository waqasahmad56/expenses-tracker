import { create } from "zustand";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
}));


