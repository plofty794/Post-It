import { Link, Outlet } from "react-router-dom";
import useGetProfile from "@/hooks/auth/useGetProfile";
import { Separator } from "@/components/ui/separator";
import PopoverMenu from "@/components/PopoverMenu";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Card } from "@/components/ui/card";
import { ping } from "ldrs";
ping.register();

function AuthenticatedLayout() {
  const { data, isPending } = useGetProfile();

  return (
    <>
      <main className="dark:bg-[#09090B] dark:text-white">
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
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            <PopoverMenu
              username={data?.data.username}
              profilePicUrl={data?.data.profilePicUrl}
            />
          </div>
        </div>
        <Separator />
        <div className="2xl:container 2xl:border-x min-h-screen w-3/4 mx-auto max-md:w-full">
          {isPending && (
            <div className="w-max mx-auto mt-24">
              <l-ping size="55" speed="2" color="white"></l-ping>
            </div>
          )}

          {!isPending && <Outlet />}
        </div>
      </main>
    </>
  );
}

export default AuthenticatedLayout;
