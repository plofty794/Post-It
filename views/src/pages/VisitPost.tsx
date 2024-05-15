import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useVisitPost from "@/hooks/auth/useVisitPost";
import { AxiosError, AxiosResponse } from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Circle } from "lucide-react";
import PostDropdownMenu from "@/components/PostDropdownMenu";
import { sanitizeHTML } from "@/lib/utils";
import PostFooter from "@/components/PostFooter";
import { useQueryClient } from "@tanstack/react-query";
import { TUserData } from "@/hooks/auth/useGetUser";
import Lottie from "lottie-react";
import Wait from "../assets/Wait.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PostComment from "@/components/PostComment";
import useGetPostComments, { TComment } from "@/hooks/auth/useGetPostComments";
import { useMemo, useState } from "react";
import CommentFooter from "@/components/CommentFooter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function VisitPost() {
  const { data, isPending, error, isError } = useVisitPost();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);

  if (isPending) {
    return (
      <div className="pt-8 pb-16">
        <Card className="w-3/4 mx-auto p-4 max-md:w-full">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[250px] rounded-xl" />
              <Skeleton className="h-4 w-[200px] rounded-xl" />
            </div>
            <div className="w-full space-y-3">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-8 pb-16">
        <Card className="w-3/4 mx-auto p-4 max-md:w-full">
          <CardHeader className="pt-0 flex flex-col gap-2 items-center justify-center">
            <div className="size-52">
              <Lottie animationData={Wait} loop={true} />
            </div>
            <Badge variant={"destructive"} className="font-bold">
              {((error as AxiosError).response as AxiosResponse).data.error}
            </Badge>
            <Button
              onClick={() => navigate("/")}
              variant={"link"}
              className="text-sm"
              size={"sm"}
            >
              Go back to homepage
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16">
      <Card className="w-3/4 mx-auto p-0 max-md:w-full">
        <div className="flex flex-col gap-4 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    data.data.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {data.data.post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(new Date(data.data.post.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </div>
            <PostDropdownMenu
              postID={data.data.post._id}
              username={data.data.post.author.username}
            />
          </div>
          <h1 className="font-bold">{data.data.post.title}</h1>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(data.data.post.body),
            }}
          ></div>
          <PostFooter
            comments={data.data.post.comments.length}
            isDownvotedByYou={
              data.data.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            isUpvotedByYou={
              data.data.post.upvote.find(
                (v) => v.upvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            upvoteCount={data.data.post.upvoteCount}
            postID={data.data.post._id}
          />
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <PostComment />
            </div>
            <Comments />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Comments() {
  const { data, isPending } = useGetPostComments();

  const parentComments = useMemo(() => {
    const group: { [key: string]: TComment[] } = {};
    data?.pages.flatMap((page) =>
      page.data.comments.forEach((comment) => {
        group[String(comment.parentComment)] ||= [];
        group[String(comment.parentComment)].push(comment);
      })
    );

    return group;
  }, [data?.pages]);

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (parentComments["null"] == null) {
    return <h1>No comments to show.</h1>;
  }

  function getReplies(commentID: string) {
    return parentComments[commentID];
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {parentComments["null"].length > 0 &&
        parentComments["null"].map((comment) => (
          <Card className="p-4" key={comment._id}>
            <Comment
              comment={comment}
              commentID={comment._id}
              getReplies={getReplies}
            />
          </Card>
        ))}
    </div>
  );
}

function Comment({
  comment,
  commentID,
  getReplies,
}: {
  comment: TComment;
  commentID: string;
  getReplies: (commentID: string) => TComment[];
}) {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  return (
    <>
      <Card className="w-full mx-auto p-0 !bg-transparent rounded-none border-y-0 border-r-0 !border-l !border-lime-400">
        <div className="flex flex-col gap-2 rounded-md p-4">
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
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(comment?.content),
            }}
          ></div>
          <CommentFooter commentID={comment?._id} />
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

export default VisitPost;
