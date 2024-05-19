import useGetYourNotifications, {
  TNotification,
} from "@/hooks/auth/useGetYourNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";
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
import { Link } from "react-router-dom";

function UserNotification() {
  const { data, isPending } = useGetYourNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useMemo(() => {
    if (isOpen) {
      return data?.pages.flatMap((page) =>
        page.data.notifications.map((v) => {
          v.read = true;
          return v;
        })
      );
    }
    return data?.pages.flatMap((page) => page.data.notifications);
  }, [data?.pages, isOpen]);

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
    <Popover onOpenChange={(v) => setIsOpen(v)}>
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
              <Link to={`/post/${v.post._id}`} key={v._id}>
                {v.type === "comment" && <CommentNotification v={v} />}
                {v.type === "postUpvote" && <UpvoteNotification v={v} />}
                {v.type === "postDownvote" && <DownvoteNotification v={v} />}
                {v.type === "reply" && <CommentReplyNotification v={v} />}
                <Separator />
              </Link>
            ))}
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
