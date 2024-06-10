import { TYourComments } from "@/hooks/auth/comments/useGetYourComments";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Circle } from "lucide-react";
import { sanitizeHTML } from "@/lib/utils";
import { Badge } from "./ui/badge";
import CommentFooter from "./CommentFooter";
import { TComment } from "@/hooks/auth/comments/useGetPostComments";
import { TUserData } from "@/hooks/auth/users/useGetUser";

function YourComment({
  yourComments,
  fetchNextPage,
  isFetchingNextPage,
  error,
}: {
  yourComments: TComment[];
  isFetchingNextPage: boolean;
  error: Error | null;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<TYourComments, unknown>, Error>
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
  }, [error, fetchNextPage, isIntersecting, yourComments.length]);

  return yourComments.map((comment, i) => (
    <div key={comment._id}>
      {i == yourComments.length - 1 ? (
        <>
          <div ref={ref} className="flex flex-col gap-2 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={
                      comment.post.author.profilePicUrl ??
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2">
                  <CardDescription className="text-xs">
                    {comment.post.author.username}
                  </CardDescription>
                  <Circle stroke="white" fill="white" className="size-3" />
                  <div className="w-full">
                    <CardDescription className="truncate text-xs">
                      {comment.post.title}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-8">
              <div className="flex items-center gap-2">
                <CardDescription className="text-xs">
                  <span className="font-semibold text-white">
                    {comment.author.username}
                  </span>{" "}
                  commented{" "}
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
              <div
                className="post-body text-sm "
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(comment.content),
                }}
              ></div>
              <CommentFooter
                postID={comment.post._id}
                isReplyALink={true}
                isDownvotedByYou={
                  comment.downvotes.find((v) => v === yourProfileData?.data._id)
                    ? true
                    : false
                }
                isUpvotedByYou={
                  comment.upvotes.find((v) => v === yourProfileData?.data._id)
                    ? true
                    : false
                }
                upvoteCount={comment.upvoteCount}
                commentID={comment._id}
              />
            </div>
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
                    comment.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <CardDescription className="text-xs">
                  {comment.post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-3" />
                <div className="w-full">
                  <CardDescription className="truncate text-xs">
                    {comment.post.title}
                  </CardDescription>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-8">
            <div className="flex items-center gap-2">
              <CardDescription className="text-xs">
                <span className="font-semibold text-white">
                  {comment.author.username}
                </span>{" "}
                commented{" "}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
            <div
              className="post-body text-sm "
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(comment.content),
              }}
            ></div>
            <CommentFooter
              postID={comment.post._id}
              isReplyALink={true}
              isDownvotedByYou={
                comment.downvotes.find((v) => v === yourProfileData?.data._id)
                  ? true
                  : false
              }
              isUpvotedByYou={
                comment.upvotes.find((v) => v === yourProfileData?.data._id)
                  ? true
                  : false
              }
              upvoteCount={comment.upvoteCount}
              commentID={comment._id}
            />
          </div>
        </div>
      )}
    </div>
  ));
}

export default YourComment;
