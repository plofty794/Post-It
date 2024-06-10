import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { authStore } from "@/store/authStore";
import { AxiosError } from "axios";

function useRefreshAccessToken() {
  const token = authStore((state) => state.token);
  const userID = token?.split("~")[1];
  return async () => {
    try {
      const { data } = await axiosPrivateRoute.post(
        `/users/refresh-token/${userID}`
      );
      return data.accessToken as string;
    } catch (error) {
      return error as AxiosError;
    }
  };
}

export default useRefreshAccessToken;
