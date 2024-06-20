import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { TPostDownvotes } from "./posts/useGetYourPostDownvotes";
import { TPost } from "./posts/useGetPosts";

function useUpdateDownvote() {
  const { postID } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postID,
      commentID,
    }: {
      postID?: string;
      commentID?: string;
    }) => {
      if (commentID) {
        return await axiosPrivateRoute.post(`/comments/downvote/${commentID}`);
      }
      return await axiosPrivateRoute.post(`/posts/downvote/${postID}`);
    },
    onSuccess(data, { postID }) {
      queryClient.setQueryData(
        ["your-post-downvotes"],
        (
          oldData: InfiniteData<TPostDownvotes, unknown>
        ): InfiniteData<TPostDownvotes, unknown> => {
          if (!oldData) {
            return {
              pages: [
                {
                  data: {
                    postDownvotes: [data.data.downvotedPost],
                  },
                },
              ],
              pageParams: [1],
            };
          }

          const downvotedPosts = oldData.pages
            .flatMap((v) => v.data.postDownvotes)
            .filter((v) => v != undefined);

          const downvoteExist = downvotedPosts.find(
            (v) => (v.post as TPost)._id === postID
          );

          if (downvoteExist) {
            const _downvotedPosts = downvotedPosts.filter(
              (v) => (v.post as TPost)._id !== postID
            );

            return {
              pages: [
                {
                  data: {
                    postDownvotes: [..._downvotedPosts],
                  },
                },
              ],
              pageParams: [1],
            };
          }

          return {
            pages: [
              {
                data: {
                  postDownvotes: [data.data.downvotedPost, ...downvotedPosts],
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
        queryKey: ["your-post-upvotes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-post-downvotes"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postID],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-comments"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", postID],
        refetchType: "all",
      });
    },
  });
}

export default useUpdateDownvote;
