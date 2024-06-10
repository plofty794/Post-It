import { useInfiniteQuery } from "@tanstack/react-query";
import { TUser } from "../users/useGetUser";
import useAxiosPrivate from "@/api/useAxiosPrivate";

function useGetPosts() {
  const axiosPrivateRoute = useAxiosPrivate();
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }): Promise<TPosts> => {
      return await axiosPrivateRoute.get(`/posts/${pageParam}`, {
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

export type TPosts = {
  data: {
    posts: TPost[];
  };
};

export type TPost = {
  author: TUser;
  body: string;
  comments: [];
  createdAt: string;
  title: string;
  updatedAt: string;
  upvote: TUpvote[];
  downvote: TDownvote[];
  upvoteCount: number;
  _id: string;
};

export type TUpvote = {
  _id: string;
  post: string | TPost;
  upvotedBy: string | TUser;
  createdAt: string;
  updatedAt: string;
};

export type TDownvote = {
  _id: string;
  post: string | TPost;
  downvotedBy: string | TUser;
  createdAt: string;
  updatedAt: string;
};

export default useGetPosts;
