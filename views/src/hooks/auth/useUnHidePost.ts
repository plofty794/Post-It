import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { THiddenPosts } from "./useGetYourHiddenPosts";

function useUnhidePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post(`/unhide-post/${postID}`);
    },
    onSuccess(data, { postID }) {
      toast.info(data.data.message);

      queryClient.setQueryData(
        ["your-hidden-posts"],
        (
          oldData: InfiniteData<THiddenPosts, unknown>
        ): InfiniteData<THiddenPosts, unknown> => {
          return {
            pages: [
              {
                data: {
                  hiddenPosts: oldData.pages.flatMap((page) =>
                    page.data.hiddenPosts.filter(
                      (post) => post.post._id != postID
                    )
                  ),
                },
              },
            ],
            pageParams: [1],
          };
        }
      );
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-hidden-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useUnhidePost;
