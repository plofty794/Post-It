import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TSavedPost } from "./useGetYourSavedPosts";
import { TPost } from "./useGetPosts";

function useGetUser() {
  const { username } = useParams();

  return useQuery({
    queryKey: ["profile", username],
    queryFn: async (): Promise<TUserData> => {
      return await axiosPrivateRoute.get(`/user/${username}`, {
        signal: AbortSignal.timeout(1000 * 60),
      });
    },
    enabled: username != null,
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

export type TUserData = {
  data: TUser;
};

export type TUser = {
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  updatedAt: string;
  username: string;
  profilePicUrl?: string;
  comments: string[];
  posts: TPost[];
  savedPosts: TSavedPost[];
  _id: string;
};

export default useGetUser;
