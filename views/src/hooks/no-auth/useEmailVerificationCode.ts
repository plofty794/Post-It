import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

function useEmailVerificationCode() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await axiosPrivateRoute.post("/verification-code", {
        email,
      });
    },
    onSuccess() {
      toast.info("Email verification code has been sent", {
        description: "Check your email inbox",
      });
    },
    onError(err) {
      toast.error("Uh oh! Something went wrong", {
        description: ((err as AxiosError).response as AxiosResponse).data.error,
      });
    },
  });
}

export default useEmailVerificationCode;
