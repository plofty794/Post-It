import { THiddenPost } from "@/hooks/auth/posts/useGetYourHiddenPosts";
import { create } from "zustand";

export const hiddenPostsStore = create<HiddenPostsState & HiddenPostsAction>(
  (set) => ({
    hiddenPosts: [],
    setHiddenPosts: (hiddenPosts) => set({ hiddenPosts }),
    add: (post) =>
      set(({ hiddenPosts }) => {
        const newSavedPosts = [post, ...hiddenPosts];
        return { hiddenPosts: newSavedPosts };
      }),
    remove: (postID) =>
      set(({ hiddenPosts }) => {
        return {
          hiddenPosts: hiddenPosts.filter((post) => post.post._id !== postID),
        };
      }),
  })
);
type HiddenPostsState = {
  hiddenPosts: THiddenPost[] | [];
};
type HiddenPostsAction = {
  setHiddenPosts: (hiddenPosts: THiddenPost[]) => void;
  add: (post: THiddenPost) => void;
  remove: (postID: string) => void;
};
