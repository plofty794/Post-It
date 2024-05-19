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
      <Button className="text-xs gap-2" size={"sm"} variant={"ghost"}>
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

export default PostFooter;
