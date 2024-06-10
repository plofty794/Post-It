import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

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
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
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
    },
  });
}

export default useUpdateDownvote;
