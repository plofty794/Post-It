import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TPosts } from "./useGetPosts";

function useGetYourPosts() {
  return useInfiniteQuery({
    queryKey: ["your-posts"],
    queryFn: async ({ pageParam = 1 }): Promise<TPosts> => {
      return await axiosPrivateRoute.get(`/posts/your-posts/${pageParam}`, {
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

export default useGetYourPosts;
