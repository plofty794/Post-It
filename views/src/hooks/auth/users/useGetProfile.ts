import { useQuery } from "@tanstack/react-query";
import { TUserData } from "./useGetUser";
import useAxiosPrivate from "@/api/useAxiosPrivate";

function useGetProfile() {
  const axiosPrivateRoute = useAxiosPrivate();
  return useQuery({
    queryKey: ["your-profile"],
    queryFn: async (): Promise<TUserData> => {
      return await axiosPrivateRoute.get("/users/me", {
        signal: AbortSignal.timeout(1000 * 60),
      });
    },
    enabled: localStorage.getItem("token") != null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60000,
    throwOnError(error) {
      if (
        error.message ===
        "Oops! It seems like your internet connection is a bit slow."
      ) {
        return true;
      }
      return false;
    },
  });
}

export default useGetProfile;
