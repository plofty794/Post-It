import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { TEditProfile } from "@/validation/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function useEditProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: TEditProfile) => {
      return await axiosPrivateRoute.patch("/users/user/edit", {
        ...values,
      });
    },
    onSuccess(data, { username }) {
      toast.success(data.data.message);
      navigate(`/user/${username}`);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },

    onSettled(_, __, { username }) {
      queryClient.invalidateQueries({
        queryKey: ["profile", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["your-posts"],
      });
    },
  });
}

export default useEditProfile;
