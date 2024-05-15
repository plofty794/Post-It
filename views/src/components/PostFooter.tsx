import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  MessageSquare,
  Share,
} from "lucide-react";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useUpdateUpvote from "@/hooks/auth/useUpdateUpvote";
import useUpdateDownvote from "@/hooks/auth/useUpdateDownvote";
import { Link } from "react-router-dom";

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
      <div className="flex items-center gap-2 border border-stone-800 rounded-md">
        <UpvoteAndDownvote
          isDownvotedByYou={isDownvotedByYou}
          isUpvotedByYou={isUpvotedByYou}
          upvoteCount={upvoteCount}
          postID={postID}
        />
      </div>
      <Link to={`/post/${postID}`}>
        <Button className="text-xs gap-2" size={"sm"} variant={"outline"}>
          <MessageSquare className="size-5" />
          <p className="text-xs">{comments}</p>
        </Button>
      </Link>
      <Button className="text-xs gap-2" size={"sm"} variant={"outline"}>
        <Share className="size-5" />
        Share
      </Button>
    </div>
  );
}

function UpvoteAndDownvote({
  postID,
  upvoteCount,
  isUpvotedByYou,
  isDownvotedByYou,
}: {
  postID: string;
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
        className={cn(
          "text-xs [&_*]:hover:stroke-white hover:!bg-green-600",
          isUpvotedByYou ? "[&_*]:stroke-white !bg-green-600" : ""
        )}
        size={"sm"}
      >
        <ArrowBigUpDashIcon className="size-5" />
      </Toggle>
      <p className="text-xs">{upvoteCount}</p>
      <Toggle
        disabled={upvoteCount <= 1}
        pressed={downvotePressed}
        onPressedChange={(v) => {
          if (upvotePressed) {
            setUpvotePressed(false);
            setDownvotePressed(true);
          } else {
            updateDownvote.mutate({ postID });

            setDownvotePressed(v);
          }
        }}
        className={cn(
          "text-xs [&_*]:hover:stroke-white hover:!bg-red-600",
          isDownvotedByYou ? "[&_*]:stroke-white !bg-red-600" : ""
        )}
        size={"sm"}
      >
        <ArrowBigDownDashIcon className="size-5" />
      </Toggle>
    </>
  );
}

export default PostFooter;
