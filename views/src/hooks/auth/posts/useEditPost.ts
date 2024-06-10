import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useEditPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postID,
      title,
      body,
    }: {
      postID?: string;
      title: string;
      body?: string;
    }) => {
      return axiosPrivateRoute.patch(`/posts/edit-post/${postID}`, {
        title,
        body,
      });
    },
    onSuccess(data) {
      toast.success(data.data.message);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { postID }) {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postID],
      });
    },
  });
}

export default useEditPost;
