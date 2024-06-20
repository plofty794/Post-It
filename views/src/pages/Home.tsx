import { Card, CardContent } from "@/components/ui/card";
import useGetPosts from "@/hooks/auth/posts/useGetPosts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Posts from "@/components/Posts";
import EmptyPosts from "@/components/EmptyPosts";

function Home() {
  const { data, isPending, fetchNextPage, isFetchingNextPage, error } =
    useGetPosts();

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.posts);
  }, [data?.pages]);

  if (isPending) {
    return (
      <div className="pt-8 pb-16">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="w-3/4 mx-auto p-4">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[250px] rounded-xl" />
                <Skeleton className="h-4 w-[200px] rounded-xl" />
              </div>
              <div className="w-full space-y-3">
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="pt-8 pb-16">
        <Card className="w-3/4 mx-auto">
          <CardContent className="flex flex-col px-0 pb-0">
            {posts && posts?.length > 0 && (
              <Posts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                posts={posts}
              />
            )}
            {posts?.length == 0 && (
              <EmptyPosts
                title="No posts to show"
                svg={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
                description="create"
              />
            )}
            {posts == null && (
              <EmptyPosts
                title="No posts to show"
                svg={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
                description="create"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Home;
