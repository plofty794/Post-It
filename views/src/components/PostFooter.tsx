import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  MessageSquare,
  Share,
} from "lucide-react";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { useState } from "react";
import useUpdateUpvote from "@/hooks/auth/useUpdateUpvote";
import useUpdateDownvote from "@/hooks/auth/useUpdateDownvote";
import { Link } from "react-router-dom";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function PostFooter({
  postID,
  upvoteCount,
  comments,
  isUpvotedByYou,
  isDownvotedByYou,
}: {
  postID: string;
  upvoteCount: number;
  isUpvotedByYou: boolean;
  isDownvotedByYou: boolean;
  comments: number;
}) {
  return (
    <div className="mt-2 w-full flex items-center gap-4">
      <div className="flex items-center gap-2">
        <UpvoteAndDownvote
          isDownvotedByYou={isDownvotedByYou}
          isUpvotedByYou={isUpvotedByYou}
          upvoteCount={upvoteCount}
          postID={postID}
        />
      </div>
      <Link to={`/post/${postID}`}>
        <Button className="text-xs gap-2" size={"sm"} variant={"ghost"}>
          <MessageSquare className="size-5" />
          <p className="text-xs">{comments}</p>
        </Button>
      </Link>
      <ShareButton postID={postID} />
    </div>
  );
}

function UpvoteAndDownvote({
  postID,
  upvoteCount,
  isUpvotedByYou,
  isDownvotedByYou,
}: {
  postID?: string;
  upvoteCount: number;
  isUpvotedByYou: boolean;
  isDownvotedByYou: boolean;
}) {
  const [upvotePressed, setUpvotePressed] = useState(false);
  const [downvotePressed, setDownvotePressed] = useState(false);
  const updateUpvote = useUpdateUpvote();
  const updateDownvote = useUpdateDownvote();

  return (
    <>
      <Toggle
        disabled={updateDownvote.isPending}
        pressed={upvotePressed}
        onPressedChange={(v) => {
          if (downvotePressed) {
            setDownvotePressed(false);
            setUpvotePressed(true);
          } else {
            setUpvotePressed(v);
            updateUpvote.mutate({ postID });
          }
        }}
        className="text-xs !border-none"
        variant={"outline"}
        size={"sm"}
      >
        <ArrowBigUpDashIcon
          color={isUpvotedByYou ? "#22c55e" : ""}
          fill={isUpvotedByYou ? "#22c55e" : ""}
          stroke={isUpvotedByYou ? "#22c55e" : "white"}
          className="size-5"
        />
      </Toggle>
      <p className="text-xs">{upvoteCount}</p>
      <Toggle
        disabled={upvoteCount <= 1 || updateDownvote.isPending}
        pressed={downvotePressed}
        onPressedChange={(v) => {
          if (upvotePressed) {
            setUpvotePressed(false);
            setDownvotePressed(true);
          } else {
            setDownvotePressed(v);
            updateDownvote.mutate({ postID });
          }
        }}
        size={"sm"}
        className="text-xs !border-none"
        variant={"outline"}
      >
        <ArrowBigDownDashIcon
          color={isDownvotedByYou ? "#DC2626" : ""}
          fill={isDownvotedByYou ? "#DC2626" : ""}
          stroke={isDownvotedByYou ? "#DC2626" : "white"}
          className="size-5"
        />
      </Toggle>
    </>
  );
}

function ShareButton({ postID }: { postID: string }) {
  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      toast.info("Link has been copied to clipboard");
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-xs gap-2" size={"sm"} variant={"ghost"}>
          <Share className="size-5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`${window.location.origin}/post/${postID}`}
              readOnly
            />
          </div>
          <Button
            onClick={async () =>
              await copyLink(`${window.location.origin}/post/${postID}`)
            }
            type="submit"
            size="sm"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PostFooter;
