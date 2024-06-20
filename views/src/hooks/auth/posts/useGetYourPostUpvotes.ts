import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TUpvote } from "./useGetPosts";

function useGetYourPostUpvotes() {
  return useInfiniteQuery({
    queryKey: ["your-post-upvotes"],
    queryFn: async ({ pageParam = 1 }): Promise<TPostUpvotes> => {
      return await axiosPrivateRoute.get(`/posts/upvotes/${pageParam}`, {
        signal: AbortSignal.timeout(1000 * 60),
      });
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

export type TPostUpvotes = {
  data: {
    postUpvotes: TUpvote[];
  };
};

export default useGetYourPostUpvotes;
