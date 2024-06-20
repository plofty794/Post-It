import { Card, CardContent } from "./ui/card";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import EmptyPosts from "./EmptyPosts";
import useGetYourComments from "@/hooks/auth/comments/useGetYourComments";
import YourComment from "./YourComment";
import { useLottie } from "lottie-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareIcon } from "lucide-react";
import Empty from "../assets/Empty.json";
import { Badge } from "./ui/badge";

function YourComments() {
  const { isPending, fetchNextPage, isFetchingNextPage, error, data } =
    useGetYourComments();

  const yourComments = useMemo(() => {
    return data?.pages.flatMap((page) =>
      page.data.yourComments.filter((obj, index, arr) => {
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
            {yourComments && yourComments?.length > 0 && (
              <YourComment
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                yourComments={yourComments}
              />
            )}
            {yourComments == null && (
              <EmptyPosts
                title="No hidden comments to show"
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
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                }
                description="hide"
              />
            )}
            {yourComments && yourComments.length < 1 && <EmptyComments />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function EmptyComments() {
  const { View, animationContainerRef } = useLottie({
    animationData: Empty,
  });

  return (
    <CardHeader className="pt-0 flex flex-col gap-2 items-center justify-center">
      <div ref={animationContainerRef} className="size-52">
        {View}
      </div>
      <CardTitle className="text-lg">No comments to show</CardTitle>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <CardDescription>Create one by commenting to a post </CardDescription>
        <Badge
          className="flex items-center justify-center gap-2 w-max"
          variant={"secondary"}
        >
          <MessageSquareIcon className="size-4" />
        </Badge>
      </div>
    </CardHeader>
  );
}

export default YourComments;
