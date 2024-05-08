import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { savedPostsStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useUnsavePost() {
  const remove = savedPostsStore((state) => state.remove);
  return useMutation({
    mutationFn: async ({ postID }: { postID?: string }) => {
      return await axiosPrivateRoute.post(`/unsave-post/${postID}`);
    },
    onSuccess(data, { postID }) {
      toast.info(data.data.message);
      if (typeof postID == "undefined") return;
      remove(postID);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
  });
}

export default useUnsavePost;
