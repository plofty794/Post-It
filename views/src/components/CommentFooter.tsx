import { ReplyIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import PostComment from "./PostComment";

function CommentFooter({ commentID }: { commentID: string }) {
  return (
    <div className="mt-2">
      <Collapsible>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button size={"sm"} variant={"outline"}>
                  <ReplyIcon className="size-4" />
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Reply</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CollapsibleContent>
          <div className="mt-2">
            <PostComment commentID={commentID} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default CommentFooter;
