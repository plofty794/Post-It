import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { savedPostsStore } from "@/store/savedPostsStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useUnsavePost() {
  const queryClient = useQueryClient();
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
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["your-saved-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useUnsavePost;
