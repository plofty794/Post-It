import useGetYourPosts from "@/hooks/auth/posts/useGetYourPosts";
import Posts from "./Posts";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";
import EmptyPosts from "./EmptyPosts";

function YourPosts() {
  const { data, isPending, fetchNextPage, isFetchingNextPage, error } =
    useGetYourPosts();

  const yourPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.posts);
  }, [data?.pages]);

  if (isPending) {
    return (
      <div className="pt-4 pb-16">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="w-full p-4">
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
      <div className="pt-4 pb-16">
        <Card className="w-full mx-auto">
          <CardContent className="flex flex-col px-0 pb-0">
            {yourPosts && yourPosts?.length > 0 && (
              <Posts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                posts={yourPosts}
              />
            )}
            {yourPosts == null && (
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

export default YourPosts;
