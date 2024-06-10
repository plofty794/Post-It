import useGetPostComments, {
  TComment,
} from "@/hooks/auth/comments/useGetPostComments";
import { useMemo } from "react";
import Comment from "@/components/Comment";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function Comments() {
  const { data, isPending, fetchNextPage, isError, isFetchingNextPage } =
    useGetPostComments();

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
    return (
      <div className="w-max mx-auto mt-24">
        <l-ping size="55" speed="2" color="white"></l-ping>
      </div>
    );
  }

  if (parentComments["null"] == null) {
    return (
      <Badge variant={"destructive"} className="w-max mx-auto font-bold">
        No comments to show
      </Badge>
    );
  }

  function getReplies(commentID: string) {
    return parentComments[commentID];
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {parentComments["null"].length > 0 &&
        parentComments["null"].map((comment, idx) =>
          idx === parentComments["null"].length - 1 ? (
            <>
              <Card className="p-4 !bg-stone-900" key={comment._id}>
                <Comment
                  comment={comment}
                  commentID={comment._id}
                  getReplies={getReplies}
                />
              </Card>
              <div className="ml-auto w-max py-2">
                {isError && (
                  <Badge variant={"destructive"}>
                    No more comments to show
                  </Badge>
                )}
                {!isError && (
                  <Button
                    disabled={isFetchingNextPage || isError}
                    onClick={() => fetchNextPage()}
                    size={"sm"}
                    variant={"outline"}
                    className="text-xs w-max"
                  >
                    {isFetchingNextPage && "Loading comments..."}
                    {!isFetchingNextPage && "View more comments"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Card className="p-4 !bg-stone-900" key={comment._id}>
              <Comment
                comment={comment}
                commentID={comment._id}
                getReplies={getReplies}
              />
            </Card>
          )
        )}
    </div>
  );
}

export default Comments;
