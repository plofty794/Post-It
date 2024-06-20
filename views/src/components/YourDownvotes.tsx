import { Card, CardContent } from "./ui/card";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import EmptyPosts from "./EmptyPosts";
import Posts from "./Posts";
import { TPost } from "@/hooks/auth/posts/useGetPosts";
import { ArrowBigDownDashIcon } from "lucide-react";
import useGetYourPostDownvotes from "@/hooks/auth/posts/useGetYourPostDownvotes";

function YourDownvotes() {
  const { isPending, fetchNextPage, isFetchingNextPage, error, data } =
    useGetYourPostDownvotes();

  const postDownvotes = useMemo(() => {
    return data?.pages.flatMap((page) =>
      page.data.postDownvotes.filter((obj, index, arr) => {
        return (
          arr.findIndex((o) => {
            return JSON.stringify(o) === JSON.stringify(obj);
          }) === index
        );
      })
    );
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
            {postDownvotes && postDownvotes?.length > 0 && (
              <Posts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                posts={postDownvotes.map(
                  (downvotes) => downvotes.post as TPost
                )}
              />
            )}
            {postDownvotes == null && (
              <EmptyPosts
                title="No downvotes to show"
                svg={<ArrowBigDownDashIcon className="size-6" />}
                description="button"
              />
            )}
            {postDownvotes && postDownvotes.length < 1 && (
              <EmptyPosts
                title="No downvotes to show"
                svg={<ArrowBigDownDashIcon className="size-6" />}
                description="button"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default YourDownvotes;
