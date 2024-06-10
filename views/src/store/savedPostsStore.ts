import { TSavedPost } from "@/hooks/auth/posts/useGetYourSavedPosts";
import { create } from "zustand";

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
        return {
          savedPosts: savedPosts.filter((post) => post.post._id !== postID),
        };
      }),
  })
);
type SavedPostsState = {
  savedPosts: TSavedPost[] | [];
};
type SavedPostsAction = {
  setSavedPosts: (savedPosts: TSavedPost[]) => void;
  add: (post: TSavedPost) => void;
  remove: (postID: string) => void;
};
