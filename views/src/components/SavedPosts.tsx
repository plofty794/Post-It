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
import {
  TSavedPost,
  TSavedPosts,
} from "@/hooks/auth/posts/useGetYourSavedPosts";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useUnsavePost from "@/hooks/auth/posts/useUnsavePost";
import PostFooter from "./PostFooter";
import { TUserData } from "@/hooks/auth/users/useGetUser";

function SavedPosts({
  savedPosts,
  fetchNextPage,
  isFetchingNextPage,
  error,
}: {
  savedPosts: TSavedPost[];
  isFetchingNextPage: boolean;
  error: Error | null;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<TSavedPosts, unknown>, Error>
  >;
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });
  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);

  useEffect(() => {
    if (error != null) return;
    if (isIntersecting && savedPosts.length >= 10) {
      fetchNextPage();
    }
  }, [error, fetchNextPage, isIntersecting, savedPosts.length]);

  return savedPosts.map((savedPost, i) => (
    <div key={savedPost._id}>
      {i == savedPosts.length - 1 ? (
        <>
          <div ref={ref} className="flex flex-col gap-2 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={
                      savedPost.post.author.profilePicUrl ??
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center gap-2">
                  <CardDescription className="text-xs">
                    {savedPost.post.author.username}
                  </CardDescription>
                  <Circle stroke="white" fill="white" className="size-1" />
                  <CardDescription className="text-xs">
                    {formatDistanceToNow(new Date(savedPost.post.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  saved{" "}
                  {formatDistanceToNow(new Date(savedPost.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
                <UnsavePost postID={savedPost.post._id} />
              </div>
            </div>
            <h1 className="font-bold">{savedPost.post.title}</h1>
            <div
              className="post-body text-sm"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(savedPost.post.body),
              }}
            ></div>
            <PostFooter
              comments={savedPost.post.comments.length}
              isDownvotedByYou={
                savedPost.post.downvote.find(
                  (v) => v.downvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              isUpvotedByYou={
                savedPost.post.downvote.find(
                  (v) => v.downvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              postID={savedPost.post._id}
              upvoteCount={savedPost.post.upvoteCount}
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
                  className="object-cover"
                  src={
                    savedPost.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {savedPost.post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(new Date(savedPost.post.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CardDescription className="text-xs">
                saved{" "}
                {formatDistanceToNow(new Date(savedPost.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
              <UnsavePost postID={savedPost.post._id} />
            </div>
          </div>
          <h1 className="font-bold">{savedPost.post.title}</h1>
          <div
            className="post-body text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(savedPost.post.body),
            }}
          ></div>
          <PostFooter
            comments={savedPost.post.comments.length}
            isDownvotedByYou={
              savedPost.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            isUpvotedByYou={
              savedPost.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            postID={savedPost.post._id}
            upvoteCount={savedPost.post.upvoteCount}
          />
        </div>
      )}
    </div>
  ));
}

function UnsavePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useUnsavePost();

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

export default SavedPosts;
