import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TPost } from "./useGetPosts";
import { AxiosResponse } from "axios";

function useVisitPost() {
  const { postID } = useParams();

  return useQuery({
    queryKey: ["post", postID],
    queryFn: async (): Promise<AxiosResponse<{ post: TPost }>> => {
      return await axiosPrivateRoute.get(`/post/${postID}`);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60000,
  });
}

export default useVisitPost;
