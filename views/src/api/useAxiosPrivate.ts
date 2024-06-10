import { authStore } from "@/store/authStore";
import { axiosPrivateRoute } from "./axiosPrivateRoute";
import { useEffect } from "react";
import { AxiosError } from "axios";
import useRefreshAccessToken from "@/hooks/auth/useRefreshAccessToken";

function useAxiosPrivate() {
  const logOut = authStore((state) => state.logOut);
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
        if (error.name === "CanceledError") {
          return Promise.reject(
            new Error(
              "Oops! It seems like your internet connection is a bit slow."
            )
          );
        }
        if (error.config && error.response?.status === 401) {
          logOut();
          return Promise.reject(error);
        }
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
  }, [logOut, refreshAccessToken, setToken, token]);

  return axiosPrivateRoute;
}

export default useAxiosPrivate;
