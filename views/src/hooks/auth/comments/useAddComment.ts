import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      commentID,
      postID,
    }: {
      postID: string;
      content: string;
      commentID?: string;
    }) => {
      return await axiosPrivateRoute.post(
        `/comments/create-comment/${postID}`,
        {
          content,
          commentID,
        }
      );
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { postID, commentID }) {
      if (commentID) {
        queryClient.invalidateQueries({
          queryKey: ["comment", commentID],
        });
        toast.success("Reply has been sent");
      }
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

export default useAddComment;
