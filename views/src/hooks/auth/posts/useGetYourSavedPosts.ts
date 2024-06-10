import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TPost } from "./useGetPosts";

function useGetYourSavedPosts() {
  return useInfiniteQuery({
    queryKey: ["your-saved-posts"],
    queryFn: async ({ pageParam = 1 }): Promise<TSavedPosts> => {
      return await axiosPrivateRoute.get(
        `/posts/your-saved-posts/${pageParam}`,
        {
          signal: AbortSignal.timeout(1000 * 60),
        }
      );
    },
    initialPageParam: 1,
    getNextPageParam: (_, page) => page.length + 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60000,
    throwOnError(error) {
      if (
        error.message ===
        "Oops! It seems like your internet connection is a bit slow."
      ) {
        return true;
      }
      return false;
    },
  });
}

export type TSavedPosts = {
  data: {
    savedPosts: TSavedPost[];
  };
};

export type TSavedPost = {
  createdAt: "2024-05-04T23:22:42.045Z";
  savedBy: "6630da627ab49348b40d3ca5";
  post: TPost;
  updatedAt: "2024-05-04T23:22:42.045Z";
  __v: 0;
  _id: "6636c342aceae7d7ce48dbdf";
};

export default useGetYourSavedPosts;
