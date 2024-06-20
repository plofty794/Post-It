import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { TPostUpvotes } from "./posts/useGetYourPostUpvotes";
import { TPost } from "./posts/useGetPosts";

function useUpdateUpvote() {
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
        return await axiosPrivateRoute.post(`/comments/upvote/${commentID}`);
      }
      return await axiosPrivateRoute.post(`/posts/upvote/${postID}`);
    },
    onSuccess(data, { postID }) {
      queryClient.setQueryData(
        ["your-post-upvotes"],
        (
          oldData: InfiniteData<TPostUpvotes, unknown>
        ): InfiniteData<TPostUpvotes, unknown> => {
          if (!oldData) {
            return {
              pages: [
                {
                  data: {
                    postUpvotes: [data.data.upvotedPost],
                  },
                },
              ],
              pageParams: [1],
            };
          }

          const upvotedPosts = oldData.pages
            .flatMap((v) => v.data.postUpvotes)
            .filter((v) => v != undefined);

          const upvoteExist = upvotedPosts.find(
            (v) => (v.post as TPost)._id === postID
          );

          if (upvoteExist) {
            const _upvotedPosts = upvotedPosts.filter(
              (v) => (v.post as TPost)._id !== postID
            );

            return {
              pages: [
                {
                  data: {
                    postUpvotes: [..._upvotedPosts],
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
                  postUpvotes: [data.data.upvotedPost, ...upvotedPosts],
                },
              },
            ],
            pageParams: [1],
          };
        }
      );
    },
    onError(err) {
      console.log(err);
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { commentID }) {
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
      queryClient.invalidateQueries({
        queryKey: ["comment", commentID],
        refetchType: "all",
      });
    },
  });
}

export default useUpdateUpvote;
