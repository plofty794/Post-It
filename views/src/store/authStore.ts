import { create } from "zustand";

export const authStore = create<UserState & UserAction>((set) => ({
  token: null ?? localStorage.getItem("token"),
  setToken: (token) =>
    set(() => {
      localStorage.setItem("token", token);
      return { token };
    }),
  logOut: () => {
    set({ token: null });
    localStorage.removeItem("token");
    window.location.reload();
  },
}));

type UserState = {
  token: string | null;
};

type UserAction = {
  setToken: (token: string) => void;
  logOut: () => void;
};
