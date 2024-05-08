import { TSavedPost } from "@/hooks/auth/useGetYourSavedPosts";
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

export const savedPostsStore = create<SavedPostsState & SavedPostsAction>(
  (set) => ({
    savedPosts: [],
    setSavedPosts: (savedPosts) => set({ savedPosts }),
    add: (post) =>
      set(({ savedPosts }) => {
        const newSavedPosts = [post, ...savedPosts];
        return { savedPosts: newSavedPosts };
      }),
    remove: (postID) =>
      set(({ savedPosts }) => {
        return { savedPosts: savedPosts.filter((post) => post._id !== postID) };
      }),
  })
);

type SavedPostsState = {
  savedPosts: TSavedPost[] | [];
};

type UserState = {
  token: string | null;
};

type SavedPostsAction = {
  setSavedPosts: (savedPosts: TSavedPost[]) => void;
  add: (post: TSavedPost) => void;
  remove: (postID: string) => void;
};

type UserAction = {
  setToken: (token: string) => void;
  logOut: () => void;
};
