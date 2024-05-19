import {
  ReplyIcon,
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PostComment from "./PostComment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";

function CommentFooter({ commentID }: { commentID: string }) {
  return (
    <div className="flex items-center gap-2">
      <CommentUpvoteAndDownvote />
      <Collapsible>
        <CollapsibleTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ReplyIcon className="size-4 " />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Reply</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2">
            <PostComment commentID={commentID} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function CommentUpvoteAndDownvote() {
  const [upvotePressed, setUpvotePressed] = useState(false);
  const [downvotePressed, setDownvotePressed] = useState(false);

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
    </>
  );
}

export default CommentFooter;
