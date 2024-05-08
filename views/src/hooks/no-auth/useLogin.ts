import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { authStore } from "@/store/authStore";
import { TLogin } from "@/validation/schemas";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useLogin() {
  const setToken = authStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (data: TLogin) => {
      return await axiosPrivateRoute.post("/login", {
        ...data,
      });
    },
    onSuccess(data) {
      setToken(data.data.token);
    },
    onError(err) {
      const message = ((err as AxiosError).response as AxiosResponse).data
        .error;
      toast.error("Uh oh! Login failed", {
        description: message,
      });
      console.log(err);
    },
  });
}

export default useLogin;
