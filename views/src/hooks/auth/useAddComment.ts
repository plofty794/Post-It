import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function useAddComment() {
  const queryClient = useQueryClient();
  const { postID } = useParams();
  return useMutation({
    mutationFn: async ({
      content,
      commentID,
    }: {
      content: string;
      commentID?: string;
    }) => {
      return await axiosPrivateRoute.post(`/create-comment/${postID}`, {
        content,
        commentID,
      });
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["post", postID],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", postID],
      });
    },
  });
}

export default useAddComment;
