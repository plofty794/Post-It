import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { TPost } from "./useGetPosts";

function useVisitPost(id?: string) {
  const { postID } = useParams();

  return useQuery({
    queryKey: ["post", id ?? postID],
    queryFn: async (): Promise<AxiosResponse<{ post: TPost }>> => {
      return await axiosPrivateRoute.get(`/posts/post/${id ?? postID}`);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60000,
  });
}

export default useVisitPost;
