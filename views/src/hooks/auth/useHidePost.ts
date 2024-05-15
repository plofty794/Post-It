import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { hiddenPostsStore } from "@/store/hiddenPostsStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useHidePost() {
  const add = hiddenPostsStore((state) => state.add);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post(`/hide-post/${postID}`);
    },
    onSuccess(data) {
      add(data.data.hiddenPost);
      toast.info(data.data.message);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-hidden-posts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
        refetchType: "all",
      });
    },
  });
}

export default useHidePost;
