import { TPost, TPosts } from "@/hooks/auth/posts/useGetPosts";
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
import PostDropdownMenu from "./PostDropdownMenu";
import PostFooter from "./PostFooter";
import { TUserData } from "@/hooks/auth/users/useGetUser";

function Posts({
  posts,
  fetchNextPage,
  isFetchingNextPage,
  error,
}: {
  posts: TPost[];
  isFetchingNextPage: boolean;
  error: Error | null;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<TPosts, unknown>, Error>
  >;
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });
  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);

  useEffect(() => {
    if (error != null) return;
    if (isIntersecting && posts.length >= 10) {
      fetchNextPage();
    }
  }, [error, fetchNextPage, isIntersecting, posts.length]);

  return posts.map((post, i) => (
    <div key={post._id}>
      {i == posts.length - 1 ? (
        <>
          <div ref={ref} className="flex flex-col gap-4 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    className="object-cover"
                    src={
                      post.author.profilePicUrl ??
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center gap-2">
                  <CardDescription className="text-xs">
                    {post.author.username}
                  </CardDescription>
                  <Circle stroke="white" fill="white" className="size-1" />
                  <CardDescription className="text-xs">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </div>
              <PostDropdownMenu
                postID={post._id}
                username={post.author.username}
              />
            </div>
            <h1 className="font-bold">{post.title}</h1>
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }}
            ></div>
            <PostFooter
              comments={post.comments.length}
              isDownvotedByYou={
                post.downvote.find(
                  (v) => v.downvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              isUpvotedByYou={
                post.upvote.find(
                  (v) => v.upvotedBy === yourProfileData?.data._id
                )
                  ? true
                  : false
              }
              upvoteCount={post.upvoteCount}
              postID={post._id}
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
        <div className="flex flex-col gap-4 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    post.author.profilePicUrl ?? "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
            <PostDropdownMenu
              postID={post._id}
              username={post.author.username}
            />
          </div>
          <h1 className="font-bold">{post.title}</h1>
          <div
            className="post-body text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }}
          ></div>
          <PostFooter
            comments={post.comments.length}
            isDownvotedByYou={
              post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            isUpvotedByYou={
              post.upvote.find((v) => v.upvotedBy === yourProfileData?.data._id)
                ? true
                : false
            }
            upvoteCount={post.upvoteCount}
            postID={post._id}
          />
        </div>
      )}
    </div>
  ));
}

export default Posts;
