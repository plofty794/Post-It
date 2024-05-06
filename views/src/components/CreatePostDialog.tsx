import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tiptap from "@/components/Tiptap";

function CreatePostDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="gap-2">
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className=" dark:text-white flex flex-col max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Tiptap />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostDialog;
