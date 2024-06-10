import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TPost } from "../posts/useGetPosts";
import { TUser } from "../users/useGetUser";

function useGetYourNotifications() {
  return useInfiniteQuery({
    queryKey: ["your-notifications"],
    queryFn: async ({ pageParam = 1 }): Promise<TNotifications> => {
      return await axiosPrivateRoute.get(
        `/users/user/notifications/${pageParam}`,
        {
          signal: AbortSignal.timeout(1000 * 60),
        }
      );
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

export type TNotifications = {
  data: {
    notifications: TNotification[];
  };
};

export type TNotification = {
  _id: string;
  recipient: TUser;
  type: "postUpvote" | "postDownvote" | "reply" | "comment";
  sender: Pick<TUser, "username" | "profilePicUrl">;
  post: TPost;
  data: unknown;
  read: boolean;
  createdAt: string;
};

export default useGetYourNotifications;
