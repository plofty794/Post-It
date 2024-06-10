import useVisitComment from "@/hooks/auth/comments/useVisitComment";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Wait from "../assets/Wait.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostDropdownMenu from "@/components/PostDropdownMenu";
import { sanitizeHTML } from "@/lib/utils";
import PostFooter from "@/components/PostFooter";
import { useQueryClient } from "@tanstack/react-query";
import { TUserData } from "@/hooks/auth/users/useGetUser";
import CommentFooter from "@/components/CommentFooter";
import { Separator } from "@/components/ui/separator";

function VisitComment() {
  const { data, isPending, error, isError } = useVisitComment();
  const queryClient = useQueryClient();
  const yourProfileData = queryClient.getQueryData<TUserData>(["your-profile"]);
  const navigate = useNavigate();

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
      <Card className="w-3/4 mx-auto p-0 max-md:w-full ">
        <div className="flex flex-col gap-4 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    data.data.comment.post.author.profilePicUrl ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2">
                <CardDescription className="text-xs">
                  {data.data.comment.post.author.username}
                </CardDescription>
                <Circle stroke="white" fill="white" className="size-1" />
                <CardDescription className="text-xs">
                  {formatDistanceToNow(
                    new Date(data.data.comment.post.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                </CardDescription>
              </div>
            </div>
            <PostDropdownMenu
              postID={data.data.comment.post._id}
              username={data.data.comment.post.author.username}
            />
          </div>
          <h1 className="font-bold">{data.data.comment.post.title}</h1>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(data.data.comment.post.body),
            }}
          ></div>
          <PostFooter
            comments={data.data.comment.post.comments.length}
            isDownvotedByYou={
              data.data.comment.post.downvote.find(
                (v) => v.downvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            isUpvotedByYou={
              data.data.comment.post.upvote.find(
                (v) => v.upvotedBy === yourProfileData?.data._id
              )
                ? true
                : false
            }
            upvoteCount={data.data.comment.post.upvoteCount}
            postID={data.data.comment.post._id}
          />
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center gap-2">
              <CardDescription className="w-max text-xs">
                Single comment thread
              </CardDescription>
              <Separator className="w-2/4" />
              <Link to={`/post/${data.data.comment.post._id}`}>
                <Button
                  className="p-0 !text-blue-400 text-xs"
                  size={"sm"}
                  variant={"link"}
                >
                  See full discussion
                </Button>
              </Link>
            </div>
            <Card className="p-4 !bg-stone-900">
              {data.data.comment.parentComment && (
                <Card className="w-full mx-auto p-0 !bg-transparent rounded-none border-y-0 border-r-0 !border-l !border-lime-400">
                  <div className="flex flex-col gap-2 rounded-md px-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={
                              data.data.comment.parentComment.author
                                .profilePicUrl ??
                              "https://github.com/shadcn.png"
                            }
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center gap-2">
                          <CardDescription className="text-xs">
                            {data.data.comment.parentComment?.author.username}
                          </CardDescription>
                          <Circle
                            stroke="white"
                            fill="white"
                            className="size-1"
                          />
                          <CardDescription className="text-xs">
                            {formatDistanceToNow(
                              new Date(
                                data.data.comment.parentComment.createdAt
                              ),
                              {
                                addSuffix: true,
                              }
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-4 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(
                          data.data.comment.parentComment.content
                        ),
                      }}
                    ></div>
                    <CommentFooter
                      postID={data.data.comment.post._id}
                      isReplyALink={false}
                      upvoteCount={data.data.comment.parentComment.upvoteCount}
                      isUpvotedByYou={
                        data.data.comment.parentComment.upvotes.find(
                          (v) => v === yourProfileData?.data._id
                        )
                          ? true
                          : false
                      }
                      isDownvotedByYou={
                        data.data.comment.parentComment.downvotes.find(
                          (v) => v === yourProfileData?.data._id
                        )
                          ? true
                          : false
                      }
                      commentID={data.data.comment.parentComment._id}
                    />
                    <Card className="w-full mx-auto p-0 !bg-transparent rounded-none border-y-0 border-r-0 !border-l !border-lime-400">
                      <div className="flex flex-col gap-2 rounded-md px-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Avatar className="size-6">
                              <AvatarImage
                                src={
                                  data.data.comment.author.profilePicUrl ??
                                  "https://github.com/shadcn.png"
                                }
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center justify-center gap-2">
                              <CardDescription className="text-xs">
                                {data.data.comment.author.username}
                              </CardDescription>
                              <Circle
                                stroke="white"
                                fill="white"
                                className="size-1"
                              />
                              <CardDescription className="text-xs">
                                {formatDistanceToNow(
                                  new Date(data.data.comment.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-4 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(data.data.comment.content),
                          }}
                        ></div>
                        <CommentFooter
                          postID={data.data.comment.post._id}
                          isReplyALink={false}
                          upvoteCount={data.data.comment.upvoteCount}
                          isUpvotedByYou={
                            data.data.comment.upvotes.find(
                              (v) => v === yourProfileData?.data._id
                            )
                              ? true
                              : false
                          }
                          isDownvotedByYou={
                            data.data.comment.downvotes.find(
                              (v) => v === yourProfileData?.data._id
                            )
                              ? true
                              : false
                          }
                          commentID={data.data.comment._id}
                        />
                      </div>
                    </Card>
                  </div>
                </Card>
              )}
              {data.data.comment.parentComment == null && (
                <Card className="w-full mx-auto p-0 !bg-transparent rounded-none border-y-0 border-r-0 !border-l !border-lime-400">
                  <div className="flex flex-col gap-2 rounded-md px-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={
                              data.data.comment.author.profilePicUrl ??
                              "https://github.com/shadcn.png"
                            }
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center gap-2">
                          <CardDescription className="text-xs">
                            {data.data.comment.author.username}
                          </CardDescription>
                          <Circle
                            stroke="white"
                            fill="white"
                            className="size-1"
                          />
                          <CardDescription className="text-xs">
                            {formatDistanceToNow(
                              new Date(data.data.comment.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-4 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(data.data.comment.content),
                      }}
                    ></div>
                    <CommentFooter
                      postID={data.data.comment.post._id}
                      isReplyALink={false}
                      upvoteCount={data.data.comment.upvoteCount}
                      isUpvotedByYou={
                        data.data.comment.upvotes.find(
                          (v) => v === yourProfileData?.data._id
                        )
                          ? true
                          : false
                      }
                      isDownvotedByYou={
                        data.data.comment.downvotes.find(
                          (v) => v === yourProfileData?.data._id
                        )
                          ? true
                          : false
                      }
                      commentID={data.data.comment._id}
                    />
                  </div>{" "}
                </Card>
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default VisitComment;
