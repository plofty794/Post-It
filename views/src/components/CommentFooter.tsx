import { ArrowBigUpDashIcon, ArrowBigDownDashIcon } from "lucide-react";
import PostComment from "./PostComment";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

function CommentFooter({ commentID }: { commentID: string }) {
  const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <CommentUpvoteAndDownvote />
        <Toggle
          className="hover:!bg-transparent !bg-transparent"
          asChild
          onPressedChange={(v) => setIsCommentInputOpen(v)}
        >
          <Button size={"sm"} variant={"link"} className="p-0 text-xs">
            Reply
          </Button>
        </Toggle>
      </div>
      <div className={cn("mt-2", isCommentInputOpen ? "block" : " hidden")}>
        <PostComment commentID={commentID} />
      </div>
    </>
  );
}

function CommentUpvoteAndDownvote() {
  const [upvotePressed, setUpvotePressed] = useState(false);
  const [downvotePressed, setDownvotePressed] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Toggle
        pressed={upvotePressed}
        onPressedChange={(v) => {
          if (downvotePressed) {
            setDownvotePressed(false);
            setUpvotePressed(true);
          } else {
            setUpvotePressed(v);
          }
        }}
        className={cn(
          "text-xs [&_*]:hover:stroke-white hover:!bg-green-600"
          // isUpvotedByYou ? "[&_*]:stroke-white !bg-green-600" : ""
        )}
        size={"sm"}
      >
        <ArrowBigUpDashIcon className="size-5" />
      </Toggle>
      <p className="text-xs">0</p>
      <Toggle
        pressed={downvotePressed}
        onPressedChange={(v) => {
          if (upvotePressed) {
            setUpvotePressed(false);
            setDownvotePressed(true);
          } else {
            setDownvotePressed(v);
          }
        }}
        className={cn(
          "text-xs [&_*]:hover:stroke-white hover:!bg-red-600"
          // isDownvotedByYou ? "[&_*]:stroke-white !bg-red-600" : ""
        )}
        size={"sm"}
      >
        <ArrowBigDownDashIcon className="size-5" />
      </Toggle>
    </div>
  );
}

export default CommentFooter;
