import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useEditComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentID,
      content,
    }: {
      commentID: string;
      content: string;
    }) => {
      return axiosPrivateRoute.patch(`/comments/edit-comment/${commentID}`, {
        content,
      });
    },
    onSuccess(data) {
      toast.success(data.data.message);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { commentID }) {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comment", commentID],
      });
    },
  });
}

export default useEditComment;
