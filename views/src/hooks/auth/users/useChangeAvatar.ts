import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function useChangeAvatar() {
  const navigate = useNavigate();
  const { username } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profilePicUrl: string) => {
      return await axiosPrivateRoute.post("/users/change-avatar", {
        profilePicUrl,
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
      navigate(`/user/${username}`);
      queryClient.invalidateQueries({
        queryKey: ["profile", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["your-profile"],
      });
    },
  });
}

export default useChangeAvatar;
