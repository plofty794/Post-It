import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body?: string }) => {
      return axiosPrivateRoute.post("/posts/create-post", {
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
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}

export default useCreatePost;
