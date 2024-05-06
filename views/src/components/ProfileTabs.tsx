import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "./ui/card";
import useGetYourPosts from "@/hooks/auth/useGetYourPosts";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import Posts from "./Posts";
import EmptyPosts from "./EmptyPosts";
import useGetYourSavedPosts from "@/hooks/auth/useGetYourSavedPosts";
import SavedPosts from "./SavedPosts";
import useGetYourHiddenPosts from "@/hooks/auth/useGetYourHiddenPosts";
import HiddenPosts from "./HiddenPosts";

function ProfileTabs() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList>
        <TabsTrigger className="rounded-md gap-2" value="posts">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
          Posts
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="saved">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          Saved
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
          Hidden posts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <YourPosts />
      </TabsContent>
      <TabsContent value="saved">
        <YourSavedPosts />
      </TabsContent>
      <TabsContent value="hidden">
        <YourHiddenPosts />
      </TabsContent>
    </Tabs>
  );
}

function YourSavedPosts() {
  const { data, isPending, fetchNextPage, isFetchingNextPage, error } =
    useGetYourSavedPosts();

  const yourSavedPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.savedPosts);
  }, [data?.pages]);

  console.log(yourSavedPosts);

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
          <CardContent className="flex flex-col px-0">
            {yourSavedPosts && yourSavedPosts?.length > 0 && (
              <SavedPosts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                savedPosts={yourSavedPosts}
              />
            )}
            {yourSavedPosts == null && (
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
          <CardContent className="flex flex-col px-0">
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

function YourHiddenPosts() {
  const { data, isPending, fetchNextPage, isFetchingNextPage, error } =
    useGetYourHiddenPosts();

  const yourHiddenPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.hiddenPosts);
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
          <CardContent className="flex flex-col px-0">
            {yourHiddenPosts && yourHiddenPosts?.length > 0 && (
              <HiddenPosts
                error={error}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hiddenPosts={yourHiddenPosts}
              />
            )}
            {yourHiddenPosts == null && (
              <EmptyPosts
                title="No hidden posts to show"
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ProfileTabs;
