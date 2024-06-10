import CommentFooter from "@/components/CommentFooter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TComment } from "@/hooks/auth/comments/useGetPostComments";
import { useState } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sanitizeHTML } from "@/lib/utils";
import { Button } from "./ui/button";
import { TUserData } from "@/hooks/auth/users/useGetUser";
import { useQueryClient } from "@tanstack/react-query";

function Comment({
  comment,
  commentID,
  getReplies,
}: {
  comment: TComment;
  commentID: string;
  getReplies: (commentID: string) => TComment[];
}) {
  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  return (
    <>
      <Card className="w-full mx-auto p-0 !bg-transparent rounded-none border-y-0 border-r-0 !border-l !border-lime-400">
        <div className="flex flex-col gap-2 rounded-md px-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    comment.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {comment?.author?.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
          </div>
          <div
            className="mt-4 text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(comment?.content),
            }}
          ></div>
          <CommentFooter
            postID={comment.post._id}
            isReplyALink={false}
            upvoteCount={comment.upvoteCount}
            isUpvotedByYou={
              comment.upvotes.find((v) => v === yourProfileData?.data._id)
                ? true
                : false
            }
            isDownvotedByYou={
              comment.downvotes.find((v) => v === yourProfileData?.data._id)
                ? true
                : false
            }
            commentID={comment?._id}
          />
          {comment.replies.length > 0 && (
            <Collapsible onOpenChange={(open) => setIsRepliesOpen(open)}>
              <CollapsibleTrigger>
                <Button className="p-0 text-xs" size={"sm"} variant={"link"}>
                  {isRepliesOpen ? "Hide" : "Show"}{" "}
                  {comment.replies.length > 1 && comment.replies.length}{" "}
                  {comment.replies.length > 1 ? "replies" : "reply"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {getReplies(commentID)?.length > 0 &&
                  getReplies(commentID).map((reply) => (
                    <Comment
                      key={reply._id}
                      comment={reply}
                      commentID={reply._id}
                      getReplies={getReplies}
                    />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Card>
    </>
  );
}

export default Comment;
