import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TComment } from "./useGetPostComments";

function useGetYourComments() {
  return useInfiniteQuery({
    queryKey: ["your-comments"],
    queryFn: async ({ pageParam = 1 }): Promise<TYourComments> => {
      return await axiosPrivateRoute.get(
        `/comments/your-comments/${pageParam}`,
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

export type TYourComments = {
  data: {
    yourComments: TComment[];
  };
};

export default useGetYourComments;
