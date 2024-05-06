import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetProfile from "@/hooks/auth/useGetProfile";
import useHidePost from "@/hooks/auth/useHidePost";
import useSavePost from "@/hooks/auth/useSavePost";
import useUnsavePost from "@/hooks/auth/useUnsavePost";

function PostDropdownMenu({
  username,
  postID,
  savedPosts,
}: {
  username: string;
  postID: string;
  savedPosts?: string[];
}) {
  const { data } = useGetProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="hover:!bg-stone-600 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="p-0">
          {savedPosts?.find((savedPost) => savedPost === postID) ? (
            <UnsavePost postID={postID} />
          ) : (
            <SavePost postID={postID} />
          )}
        </DropdownMenuItem>
        {username !== data?.data.username && (
          <>
            <DropdownMenuItem className=" p-0">
              <HidePost postID={postID} />
            </DropdownMenuItem>
            <DropdownMenuItem className=" p-0">
              <Button
                size={"sm"}
                variant={"ghost"}
                className="justify-evenly w-full text-xs !bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
                Report
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SavePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useSavePost();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="justify-evenly w-full text-xs !bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
      Save
    </Button>
  );
}

function UnsavePost({ postID }: { postID?: string }) {
  const { mutate, isPending } = useUnsavePost();
  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="justify-evenly w-full text-xs !bg-transparent"
    >
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
          d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
        />
      </svg>
      Unsave
    </Button>
  );
}

function HidePost({ postID }: { postID: string }) {
  const { mutate, isPending } = useHidePost();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ postID })}
      size={"sm"}
      variant={"ghost"}
      className="justify-evenly w-full text-xs !bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
      Hide
    </Button>
  );
}

export default PostDropdownMenu;
