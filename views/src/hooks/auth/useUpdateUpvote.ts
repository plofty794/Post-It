import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

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
    onError(err) {
      console.log(err);
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { commentID }) {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postID],
      });
      queryClient.invalidateQueries({
        queryKey: ["your-comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", postID],
      });
      queryClient.invalidateQueries({
        queryKey: ["comment", commentID],
      });
    },
  });
}

export default useUpdateUpvote;
