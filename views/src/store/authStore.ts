import { create } from "zustand";

export const authStore = create<State & Action>((set) => ({
  token: null ?? localStorage.getItem("token"),
  setToken: (token) =>
    set(() => {
      localStorage.setItem("token", token);
      return { token };
    }),
  logOut: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));

type State = {
  token: string | null;
};

type Action = {
  setToken: (token: string) => void;
  logOut: () => void;
};
