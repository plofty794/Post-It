import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function useUpdateDownvote() {
  const { postID } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postID }: { postID: string }) => {
      return await axiosPrivateRoute.post("/downvote", {
        postID,
      });
    },
    onError(error) {
      console.log(error);
    },
    onSettled() {
      if (postID) {
        queryClient.invalidateQueries({
          queryKey: ["post", postID],
          refetchType: "all",
        });
      }
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

export default useUpdateDownvote;
