import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function PopoverMenu({
  profilePicUrl,
  username,
}: {
  profilePicUrl?: string;
  username?: string;
}) {
  const logOut = authStore((state) => state.logOut);

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={profilePicUrl ?? "https://github.com/shadcn.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1 flex flex-col gap-1" align="end">
        <Link to={`/user/${username}`}>
          <Button className="w-full gap-2 justify-start" variant={"secondary"}>
            <Avatar className="w-5 h-5">
              <AvatarImage
                className="object-cover"
                src={profilePicUrl ?? "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">View profile</p>
          </Button>
        </Link>
        <Button
          onClick={logOut}
          className="w-full gap-2 justify-start"
          variant={"secondary"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverMenu;
