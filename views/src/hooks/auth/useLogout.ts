import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { authStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

function useLogout() {
  const logOut = authStore((state) => state.logOut);

  return useMutation({
    mutationFn: async () => {
      return await axiosPrivateRoute.post("/logout");
    },
    onSettled() {
      logOut();
    },
  });
}

export default useLogout;
