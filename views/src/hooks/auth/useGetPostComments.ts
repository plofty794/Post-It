import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TUser } from "./useGetUser";
import { TPost } from "./useGetPosts";

function useGetPostComments() {
  const { postID } = useParams();
  return useInfiniteQuery({
    queryKey: ["comments", postID],
    queryFn: async ({ pageParam = 1 }): Promise<TComments> => {
      return await axiosPrivateRoute.get(`/comments/${postID}/${pageParam}`, {
        signal: AbortSignal.timeout(1000 * 60),
      });
    },
    initialPageParam: 1,
    getNextPageParam: (_, page) => page.length + 1,
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

export type TComments = {
  data: {
    comments: TComment[];
  };
};

export type TComment = {
  author: TUser;
  content: string;
  createdAt: string;
  parentComment: null;
  post: TPost;
  replies: TComment[];
  updatedAt: string;
  _id: string;
};

export default useGetPostComments;
