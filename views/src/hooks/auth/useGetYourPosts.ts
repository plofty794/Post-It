import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TPosts } from "./useGetPosts";

function useGetYourPosts() {
  return useInfiniteQuery({
    queryKey: ["your-posts"],
    queryFn: async ({ pageParam = 1 }): Promise<TPosts> => {
      return await axiosPrivateRoute.get(`/your-posts/${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (_, page) => page.length + 1,
    refetchOnMount: false,
  });
}

export default useGetYourPosts;
