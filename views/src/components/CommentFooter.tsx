import {
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import PostComment from "./PostComment";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import useUpdateUpvote from "@/hooks/auth/useUpdateUpvote";
import useUpdateDownvote from "@/hooks/auth/useUpdateDownvote";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

function CommentFooter({
  postID,
  commentID,
  upvoteCount,
  isUpvotedByYou,
  isDownvotedByYou,
  isReplyALink,
}: {
  postID: string;
  commentID: string;
  upvoteCount: number;
  isUpvotedByYou: boolean;
  isDownvotedByYou: boolean;
  isReplyALink: boolean;
}) {
  const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <CommentUpvoteAndDownvote
          commentID={commentID}
          isDownvotedByYou={isDownvotedByYou}
          isUpvotedByYou={isUpvotedByYou}
          upvoteCount={upvoteCount}
        />
        {isReplyALink && (
          <Link to={`/comment/${commentID}`} target="_blank">
            {" "}
            <Button size={"sm"} variant={"link"} className="p-0 text-xs">
              Reply
            </Button>
          </Link>
        )}
        {!isReplyALink && (
          <Toggle
            className="hover:!bg-transparent !bg-transparent"
            asChild
            onPressedChange={(v) => setIsCommentInputOpen(v)}
          >
            <Button size={"sm"} variant={"link"} className="p-0 text-xs">
              {isCommentInputOpen ? "Cancel" : "Reply"}
            </Button>
          </Toggle>
        )}

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
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="p-0">
              <Button
                className="text-xs gap-2 !bg-transparent"
                size={"sm"}
                variant={"ghost"}
              >
                <PencilIcon className="size-4" />
                Edit comment
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Button
                size={"sm"}
                variant={"ghost"}
                className="text-xs gap-2 !bg-transparent"
              >
                <Trash2Icon className="size-4" />
                Delete comment
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("mt-2", isCommentInputOpen ? "block" : " hidden")}>
        <PostComment postID={postID} commentID={commentID} />
      </div>
    </>
  );
}

function CommentUpvoteAndDownvote({
  commentID,
  upvoteCount,
  isUpvotedByYou,
  isDownvotedByYou,
}: {
  commentID?: string;
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
            updateUpvote.mutate({ commentID });
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
            updateDownvote.mutate({ commentID });
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

export default CommentFooter;
