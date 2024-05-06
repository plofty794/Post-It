import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function useGetUser() {
  const { username } = useParams();

  return useQuery({
    queryKey: ["profile", username],
    queryFn: async (): Promise<TUserData> => {
      return await axiosPrivateRoute.get(`/user/${username}`);
    },
    enabled: username != null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
  posts: string[];
  savedPosts: string[];
  _id: string;
};

export default useGetUser;
