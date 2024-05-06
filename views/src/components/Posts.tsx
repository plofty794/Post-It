import { TPost, TPosts } from "@/hooks/auth/useGetPosts";
import { sanitizeHTML } from "@/lib/utils";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Circle } from "lucide-react";
import PostDropdownMenu from "./PostDropdownMenu";

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

  useEffect(() => {
    if (error != null) return;
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [error, fetchNextPage, isIntersecting, posts.length]);

  const savedPosts = useMemo(() => {
    return posts.flatMap((post) => post.author.savedPosts);
  }, [posts]);

  return posts.map((post, i) => (
    <div key={post._id}>
      {i == posts.length - 1 ? (
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
                savedPosts={savedPosts}
                postID={post._id}
                username={post.author.username}
              />
            </div>
            <h1 className="font-bold">{post.title}</h1>
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }}
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
              savedPosts={savedPosts}
              postID={post._id}
              username={post.author.username}
            />
          </div>
          <h1 className="font-bold">{post.title}</h1>
          <div
            className="post-body text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }}
          ></div>
        </div>
      )}
    </div>
  ));
}

export default Posts;
