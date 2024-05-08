import { useInfiniteQuery } from "@tanstack/react-query";
import { TUser } from "./useGetUser";
import useAxiosPrivate from "@/api/useAxiosPrivate";

function useGetPosts() {
  const axiosPrivateRoute = useAxiosPrivate();
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }): Promise<TPosts> => {
      return await axiosPrivateRoute.get(`/posts/${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (_, page) => page.length + 1,
  });
}

export type TPosts = {
  data: {
    posts: [TPost];
  };
};

export type TPost = {
  author: TUser;
  body: string;
  comments: [];
  createdAt: string;
  downvote: number;
  title: string;
  updatedAt: string;
  upvote: number;
  _id: string;
};

export default useGetPosts;
