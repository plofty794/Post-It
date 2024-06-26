import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { TSavedPosts } from "./useGetYourSavedPosts";

function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post(`/posts/save-post/${postID}`);
    },
    onSuccess: async (data) => {
      toast.info(data.data.message);

      await queryClient.fetchQuery({
        queryKey: ["your-saved-posts"],
      });

      queryClient.setQueryData(
        ["your-saved-posts"],
        (
          oldData: InfiniteData<TSavedPosts, unknown>
        ): InfiniteData<TSavedPosts, unknown> => {
          return {
            pages: [
              {
                data: {
                  savedPosts: [
                    data.data.savedPost,
                    ...oldData.pages.flatMap((page) => page.data.savedPosts),
                  ],
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
        queryKey: ["your-saved-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useSavePost;
