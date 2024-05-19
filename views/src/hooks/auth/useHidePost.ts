import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { TPosts } from "./useGetPosts";
import { THiddenPosts } from "./useGetYourHiddenPosts";

function useHidePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post(`/hide-post/${postID}`);
    },
    onSuccess: async (data, { postID }) => {
      toast.info(data.data.message);

      await queryClient.fetchQuery({
        queryKey: ["your-hidden-posts"],
      });

      queryClient.setQueryData(
        ["your-hidden-posts"],
        (
          oldData: InfiniteData<THiddenPosts, unknown>
        ): InfiniteData<THiddenPosts, unknown> => {
          return {
            pages: [
              {
                data: {
                  hiddenPosts: [
                    data.data.hiddenPost,
                    ...oldData.pages.flatMap((page) => page.data.hiddenPosts),
                  ],
                },
              },
            ],
            pageParams: [1],
          };
        }
      );

      queryClient.setQueryData(
        ["posts"],
        (
          oldData: InfiniteData<TPosts, unknown>
        ): InfiniteData<TPosts, unknown> => {
          return {
            pages: [
              {
                data: {
                  posts: oldData.pages.flatMap((page) =>
                    page.data.posts.filter((post) => post._id != postID)
                  ),
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
          return {
            pages: [
              {
                data: {
                  posts: oldData.pages.flatMap((page) =>
                    page.data.posts.filter((post) => post._id != postID)
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

export default useHidePost;
