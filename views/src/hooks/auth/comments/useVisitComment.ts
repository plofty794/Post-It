import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { TComment } from "./useGetPostComments";

function useVisitComment() {
  const { commentID } = useParams();
  return useQuery({
    queryKey: ["comment", commentID],
    queryFn: async (): Promise<AxiosResponse<{ comment: TComment }>> => {
      return await axiosPrivateRoute.get(`/comments/${commentID}`);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: 60000,
  });
}

export default useVisitComment;
