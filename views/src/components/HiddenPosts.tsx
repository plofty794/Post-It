import { sanitizeHTML } from "@/lib/utils";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Circle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { THiddenPost, THiddenPosts } from "@/hooks/auth/useGetYourHiddenPosts";
import useUnhidePost from "@/hooks/auth/useUnHidePost";

function HiddenPosts({
  hiddenPosts,
  fetchNextPage,
  isFetchingNextPage,
  error,
}: {
  hiddenPosts: THiddenPost[];
  isFetchingNextPage: boolean;
  error: Error | null;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<THiddenPosts, unknown>, Error>
  >;
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });

  useEffect(() => {
    if (error != null) return;
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [error, fetchNextPage, isIntersecting, hiddenPosts.length]);

  return hiddenPosts.map((hiddenPost, i) => (
    <div key={hiddenPost._id}>
      {i == hiddenPosts.length - 1 ? (
        <>
          <div
            ref={ref}
            className="flex flex-col gap-2 rounded-md hover:bg-[#292524] p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    className="object-cover"
                    src={
                      hiddenPost.post.author.profilePicUrl ??
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center gap-2">
                  <CardDescription className="text-xs">
                    {hiddenPost.post.author.username}
                  </CardDescription>
                  <Circle stroke="white" fill="white" className="size-1" />
                  <CardDescription className="text-xs">
                    {formatDistanceToNow(new Date(hiddenPost.post.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  saved{" "}
                  {formatDistanceToNow(new Date(hiddenPost.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
                <UnhidePost postID={hiddenPost.post._id} />
              </div>
            </div>
            <h1 className="font-bold">{hiddenPost.post.title}</h1>
            <div
              className="post-body text-sm"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(hiddenPost.post.body),
              }}
            ></div>
          </div>
          <div className="p-4 w-max mx-auto">
            {isFetchingNextPage && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-9 animate-bounce opacity-60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            )}
            {error != null && (
              <Badge className="w-max mx-auto">Nothing more to load</Badge>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 rounded-md hover:bg-[#292524] p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    hiddenPost.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {hiddenPost.post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(new Date(hiddenPost.post.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CardDescription className="text-xs">
                saved{" "}
                {formatDistanceToNow(new Date(hiddenPost.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
              <UnhidePost postID={hiddenPost.post._id} />
            </div>
          </div>
          <h1 className="font-bold">{hiddenPost.post.title}</h1>
          <div
            className="post-body text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(hiddenPost.post.body),
            }}
          ></div>
        </div>
      )}
    </div>
  ));
}

function UnhidePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useUnhidePost();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isPending}
            onClick={() => mutate({ postID })}
            size={"sm"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
              />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Unsave post</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default HiddenPosts;
