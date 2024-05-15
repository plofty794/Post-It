import { sanitizeHTML } from "@/lib/utils";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useQueryClient,
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
import PostFooter from "./PostFooter";
import { TUserData } from "@/hooks/auth/useGetUser";

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
  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);

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
          <div ref={ref} className="flex flex-col gap-2 rounded-md p-4">
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
                  hidden{" "}
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
            <PostFooter
              comments={hiddenPost.post.comments.length}
              isDownvotedByYou={
                hiddenPost.post.downvote.find(
                  (v) => v.downvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              isUpvotedByYou={
                hiddenPost.post.downvote.find(
                  (v) => v.downvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              postID={hiddenPost.post._id}
              upvoteCount={hiddenPost.post.upvoteCount}
            />
          </div>
          {isFetchingNextPage && (
            <div className="p-4 w-max mx-auto">
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
            </div>
          )}
          {error != null && (
            <div className="p-4 w-max mx-auto">
              <Badge variant={"destructive"} className="w-max mx-auto">
                Nothing more to load
              </Badge>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2 rounded-md p-4">
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
                hidden{" "}
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
          <PostFooter
            comments={hiddenPost.post.comments.length}
            isDownvotedByYou={
              hiddenPost.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            isUpvotedByYou={
              hiddenPost.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            postID={hiddenPost.post._id}
            upvoteCount={hiddenPost.post.upvoteCount}
          />
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Unhide post</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default HiddenPosts;
