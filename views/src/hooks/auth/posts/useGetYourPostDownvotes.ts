import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TDownvote } from "./useGetPosts";

function useGetYourPostDownvotes() {
  return useInfiniteQuery({
    queryKey: ["your-post-downvotes"],
    queryFn: async ({ pageParam = 1 }): Promise<TPostDownvotes> => {
      return await axiosPrivateRoute.get(`/posts/downvotes/${pageParam}`, {
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

export type TPostDownvotes = {
  data: {
    postDownvotes: TDownvote[];
  };
};

export default useGetYourPostDownvotes;
