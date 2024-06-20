import { Link, Outlet } from "react-router-dom";
import useGetProfile from "@/hooks/auth/users/useGetProfile";
import { Separator } from "@/components/ui/separator";
import PopoverMenu from "@/components/PopoverMenu";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Card } from "@/components/ui/card";
import { ping } from "ldrs";
import { useDocumentTitle } from "usehooks-ts";
import { useEffect } from "react";
import UserNotification from "@/components/UserNotification";
import { useQueryClient } from "@tanstack/react-query";
ping.register();

function AuthenticatedLayout() {
  useDocumentTitle("Post It");
  const { data, isPending } = useGetProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource(
      import.meta.env.VITE_PROD_SERVER_URL + "/new-notification"
    );

    source.addEventListener("new-notification", (e) => {
      console.log(e);
      if (data?.data._id === (e.data as string).split("=")[1]) {
        queryClient.invalidateQueries({
          queryKey: ["your-notifications"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["your-posts"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["posts"],
          refetchType: "all",
        });
      }
    });
  }, [data?.data._id, queryClient]);

  return (
    <>
      <main className="dark:bg-[#09090B] dark:text-white">
        <div className="2xl:container">
          <div className="sticky top-0 z-20 backdrop-blur-md">
            <div className="w-full flex justify-between items-center px-6 pt-4 pb-2">
              <Link className="flex items-center justify-center gap-2" to={"/"}>
                <Card className="rounded-md overflow-hidden w-max">
                  <img
                    src="/post it logo.jpg"
                    className="size-10 hover:scale-110 transition-transform object-cover"
                  />
                </Card>
                <h1 className="logo text-2xl font-medium">Post It</h1>
              </Link>
              <div className="flex items-center justify-center gap-4">
                <CreatePostDialog />
                <UserNotification />
                <PopoverMenu
                  username={data?.data.username}
                  profilePicUrl={data?.data.profilePicUrl}
                />
              </div>
            </div>
            <Separator />
          </div>
          <div className="min-h-screen w-3/4 mx-auto max-md:w-full">
            {isPending && (
              <div className="w-max mx-auto mt-24">
                <l-ping size="55" speed="2" color="white"></l-ping>
              </div>
            )}

            {!isPending && <Outlet />}
          </div>
        </div>
      </main>
    </>
  );
}

export default AuthenticatedLayout;
