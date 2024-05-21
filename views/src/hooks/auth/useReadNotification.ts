import { axiosPrivateRoute } from "@/api/axiosPrivateRoute";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { TNotifications } from "./useGetYourNotifications";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function useReadNotification() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      notificationID,
    }: {
      notificationID: string;
      postID?: string;
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["your-notifications"],
      });

      const notifications = queryClient.getQueryData<
        InfiniteData<TNotifications, unknown>
      >(["your-notifications"]);

      if (!notifications) return;

      const _notifications = notifications.pages.flatMap(
        (page) => page.data.notifications
      );

      if (!_notifications) return;

      const isRead = _notifications.find((v) => v._id === notificationID);

      if (isRead && isRead.read === true) return;

      return await axiosPrivateRoute.patch(
        `/user/read-notification/${notificationID}`
      );
    },
    onSuccess: async (_, { notificationID, postID }) => {
      await queryClient.cancelQueries({
        queryKey: ["your-notifications"],
      });

      queryClient.setQueryData(
        ["your-notifications"],
        (
          oldData: InfiniteData<TNotifications, unknown>
        ): InfiniteData<TNotifications, unknown> => {
          const mutatedNotifications = oldData.pages.flatMap((page) =>
            page.data.notifications.map((v) => {
              if (v._id === notificationID) {
                v.read = true;
              }

              return v;
            })
          );

          return {
            pages: [
              {
                data: {
                  notifications: mutatedNotifications,
                },
              },
            ],
            pageParams: [1],
          };
        }
      );

      postID && navigate(`/post/${postID}`);
    },
    onError(err) {
      const error = ((err as AxiosError).response as AxiosResponse).data.error;
      toast.error(error);
    },
    onSettled(_, __, { postID }) {
      queryClient.invalidateQueries({
        queryKey: ["your-notifications"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["post", postID],
        refetchType: "all",
      });
    },
  });
}

export default useReadNotification;
