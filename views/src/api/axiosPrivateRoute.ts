import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const axiosPrivateRoute = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

axiosPrivateRoute.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosPrivateRoute.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if ((error as AxiosError).message === "Network Error") {
      const token = localStorage.getItem("token");
      token && localStorage.removeItem("token");
      toast.warning("Server failed to respond", {
        description: "Network error",
        action: {
          label: "Reload",
          onClick: () => window.location.reload(),
        },
        actionButtonStyle: {
          fontWeight: 500,
        },
      });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
