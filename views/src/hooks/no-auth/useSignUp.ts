import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { TEmailVerificationCode } from "@/validation/schemas";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function useSignUp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: TEmailVerificationCode) => {
      return await axiosPrivateRoute.post("/users/sign-up", {
        ...data,
      });
    },
    onSuccess(data) {
      toast.success("Thank you for signup up!", {
        description: data.data.message,
      });
      navigate("/login");
    },
    onError(err) {
      const errors = ((err as AxiosError).response as AxiosResponse).data;

      toast.error("Uh oh! Sign up failed", {
        description: errors.error,
      });
    },
  });
}

export default useSignUp;
