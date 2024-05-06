import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLottie } from "lottie-react";
import Empty from "../assets/Empty.json";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

function EmptyPosts({
  title,
  svg,
  description,
}: {
  title: string;
  svg: ReactNode;
  description: string;
}) {
  const { View, animationContainerRef } = useLottie({
    animationData: Empty,
  });

  return (
    <CardHeader className="pt-0 flex flex-col gap-2 items-center justify-center">
      <div ref={animationContainerRef} className="size-52">
        {View}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
      <div className="flex items-center gap-2">
        <CardDescription>Create one by clicking the </CardDescription>
        <Badge
          className="flex items-center justify-center gap-2 w-max"
          variant={"secondary"}
        >
          {svg}
          {description}
        </Badge>
        {title === "No posts to show" && (
          <CardDescription>button at the top navigation</CardDescription>
        )}
      </div>
    </CardHeader>
  );
}

export default EmptyPosts;
