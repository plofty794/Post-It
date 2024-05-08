import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { savedPostsStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useSavePost() {
  const add = savedPostsStore((state) => state.add);
  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post(`/save-post/${postID}`);
    },
    onSuccess(data) {
      toast.info(data.data.message);
      add(data.data.savedPost);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
  });
}

export default useSavePost;
