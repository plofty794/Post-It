import useGetYourNotifications, {
  TNotification,
} from "@/hooks/auth/notifications/useGetYourNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";
import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  Circle,
  MegaphoneIcon,
  MessageCircleIcon,
  MessageCircleReplyIcon,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { CardDescription } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "./ui/separator";
import useReadNotification from "@/hooks/auth/notifications/useReadNotification";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function UserNotification() {
  const readNotification = useReadNotification();
  const { data, isPending, fetchNextPage, isFetchingNextPage, isError } =
    useGetYourNotifications();

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.notifications);
  }, [data?.pages]);

  if (isPending) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 animate-pulse"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
    );
  }

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {notifications &&
          notifications.length > 0 &&
          notifications.find((v) => v.read === false) != null && (
            <span className="absolute -top-1 -right-1">
              <Circle
                className="size-[0.6rem]"
                color="#52A8FF"
                fill="#52A8FF"
              />
            </span>
          )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96  p-0">
        <ScrollArea className="h-72">
          {notifications &&
            notifications.length > 0 &&
            notifications.map((v) => (
              <span
                className={cn(
                  "relative hover:cursor-pointer",
                  readNotification.isPending ? "opacity-70" : "opacity-100"
                )}
                onClick={() =>
                  readNotification.mutate({
                    notificationID: v._id,
                    postID: v.post._id,
                  })
                }
                key={v._id}
              >
                {v.type === "comment" && <CommentNotification v={v} />}
                {v.type === "postUpvote" && <UpvoteNotification v={v} />}
                {v.type === "postDownvote" && <DownvoteNotification v={v} />}
                {v.type === "reply" && <CommentReplyNotification v={v} />}
                {!v.read && (
                  <span className="absolute top-[45%] right-4">
                    <Circle
                      className="size-[0.6rem]"
                      color="#52A8FF"
                      fill="#52A8FF"
                    />
                  </span>
                )}
                <Separator />
              </span>
            ))}
          {notifications && notifications.length >= 10 && (
            <>
              <div className="mx-auto w-max py-4">
                {isError && (
                  <Badge variant={"destructive"}>Nothing more to load</Badge>
                )}
                {!isError && (
                  <Button
                    disabled={isFetchingNextPage || isError}
                    onClick={() => fetchNextPage()}
                    size={"sm"}
                    variant={"ghost"}
                    className={"text-xs w-max"}
                  >
                    {isFetchingNextPage && "Loading notifications..."}
                    {!isFetchingNextPage && "Load more notifications"}
                  </Button>
                )}
              </div>
            </>
          )}
          {!notifications && (
            <div className="h-72 flex items-center justify-center">
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="p-4 rounded-full bg-[#111111]">
                  <MegaphoneIcon className="size-6" />
                </div>
                <CardDescription className="text-sm">
                  No new notifications
                </CardDescription>
              </div>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function CommentNotification({ v }: { v: TNotification }) {
  return (
    <div className="hover:bg-stone-800 p-4 flex gap-6 items-start">
      <div className="p-2 rounded-full bg-[#111111]">
        <MessageCircleIcon className="size-6" />
      </div>
      <div className="flex flex-col w-3/4">
        <div className="w-full">
          <p className="w-fit text-sm font-medium line-clamp-2">
            <span className="font-bold">{v.sender.username}</span> has commented
            to your post
          </p>
        </div>
        <CardDescription className=" text-sm">
          {formatDistanceToNow(new Date(v.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </div>
    </div>
  );
}

function UpvoteNotification({ v }: { v: TNotification }) {
  return (
    <div className="hover:bg-stone-800 p-4 flex gap-6 items-start">
      <div className="p-2 rounded-full bg-[#111111]">
        <ArrowBigUpDashIcon color="#22c55e" className="size-6" />
      </div>
      <div className="flex flex-col w-3/4">
        <div className="w-full">
          <p className="w-fit text-sm font-medium line-clamp-2">
            <span className="font-bold">{v.sender.username}</span> has upvoted
            your post
          </p>
        </div>
        <CardDescription className=" text-sm">
          {formatDistanceToNow(new Date(v.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </div>
    </div>
  );
}

function DownvoteNotification({ v }: { v: TNotification }) {
  return (
    <div className="hover:bg-stone-800 p-4 flex gap-6 items-start">
      <div className="p-2 rounded-full bg-[#111111]">
        <ArrowBigDownDashIcon color="#DC2626" className="size-6" />
      </div>
      <div className="flex flex-col w-3/4">
        <div className="w-full">
          <p className="w-fit text-sm font-medium line-clamp-2">
            <span className="font-bold">{v.sender.username}</span> has downvoted
            your post
          </p>
        </div>
        <CardDescription className=" text-sm">
          {formatDistanceToNow(new Date(v.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </div>
    </div>
  );
}

function CommentReplyNotification({ v }: { v: TNotification }) {
  return (
    <div className="hover:bg-stone-800 p-4 flex gap-6 items-start">
      <div className="p-2 rounded-full bg-[#111111]">
        <MessageCircleReplyIcon className="size-6" />
      </div>
      <div className="flex flex-col w-3/4">
        <div className="w-full">
          <p className="w-fit text-sm font-medium line-clamp-2">
            <span className="font-bold">{v.sender.username}</span> has replied
            your comment
          </p>
        </div>
        <CardDescription className=" text-sm">
          {formatDistanceToNow(new Date(v.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </div>
    </div>
  );
}

export default UserNotification;
