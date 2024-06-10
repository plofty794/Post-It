import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { authStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useLogout() {
  const logOut = authStore((state) => state.logOut);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await axiosPrivateRoute.delete("/users/logout");
    },
    onSettled() {
      queryClient.removeQueries();
      queryClient.clear();
      logOut();
    },
  });
}

export default useLogout;
