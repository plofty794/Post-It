import { authStore } from "@/store/authStore";
import { axiosPrivateRoute } from "./axiosPrivateRoute";
import { useEffect } from "react";
import { AxiosError } from "axios";
import useRefreshAccessToken from "@/hooks/auth/useRefreshAccessToken";

function useAxiosPrivate() {
  const token = authStore((state) => state.token);
  const setToken = authStore((state) => state.setToken);
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivateRoute.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosPrivateRoute.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err) => {
        const error = err as AxiosError;
        if (error.config && error.response?.status === 403) {
          const accessToken = await refreshAccessToken();
          if (accessToken instanceof AxiosError)
            return Promise.reject(accessToken.message);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          setToken(accessToken);
          return axiosPrivateRoute(error.config);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateRoute.interceptors.response.eject(responseInterceptor);
      axiosPrivateRoute.interceptors.request.eject(requestInterceptor);
    };
  }, [refreshAccessToken, setToken, token]);

  return axiosPrivateRoute;
}

export default useAxiosPrivate;
