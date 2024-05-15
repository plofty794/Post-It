import axios from "axios";

export const axiosPrivateRoute = axios.create({
  baseURL: import.meta.env.VITE_PROD_SERVER_URL,
  withCredentials: true,
});
