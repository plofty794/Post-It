import useGetYourSavedPosts from "@/hooks/auth/posts/useGetYourSavedPosts";
import SavedPosts from "./SavedPosts";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";
import EmptyPosts from "./EmptyPosts";

function YourSavedPosts() {
  const { isPending, fetchNextPage, isFetchingNextPage, error, data } =
    useGetYourSavedPosts();

  const savedPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.savedPosts);
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
            {savedPosts && savedPosts?.length > 0 && (
              <SavedPosts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                savedPosts={savedPosts}
              />
            )}
            {savedPosts == null && (
              <EmptyPosts
                title="No saved posts"
                svg={
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
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                }
                description="button"
              />
            )}
            {savedPosts && savedPosts.length < 1 && (
              <EmptyPosts
                title="No saved posts"
                svg={
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
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                }
                description="button"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default YourSavedPosts;
