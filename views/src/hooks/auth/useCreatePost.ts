import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useCreatePost() {
  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body?: string }) => {
      return axiosPrivateRoute.post("/create-post", {
        title,
        body,
      });
    },
    onSuccess(data) {
      toast.success(data.data.message);
    },
    onError(err) {
      console.log(err);
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
      window.location.reload();
    },
  });
}

export default useCreatePost;
