import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { TPosts } from "./useGetPosts";

function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.delete(`/posts/delete-post/${postID}`);
    },
    onSuccess(data, { postID }) {
      toast.success(data.data.message);

      queryClient.setQueryData(
        ["posts"],
        (
          oldData: InfiniteData<TPosts, unknown>
        ): InfiniteData<TPosts, unknown> => {
          const updatedPosts = oldData.pages.flatMap((v) =>
            v.data.posts.filter((v) => v._id !== postID)
          );

          return {
            pages: [
              {
                data: {
                  posts: updatedPosts,
                },
              },
            ],
            pageParams: [1],
          };
        }
      );

      queryClient.setQueryData(
        ["your-posts"],
        (
          oldData: InfiniteData<TPosts, unknown>
        ): InfiniteData<TPosts, unknown> => {
          const updatedPosts = oldData.pages.flatMap((v) =>
            v.data.posts.filter((v) => v._id !== postID)
          );

          return {
            pages: [
              {
                data: {
                  posts: updatedPosts,
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
        queryKey: ["your-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-saved-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-hidden-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useDeletePost;
