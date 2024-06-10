import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  BookmarkIcon,
  EyeOffIcon,
  MessageSquareIcon,
  NotebookPenIcon,
} from "lucide-react";

import YourPosts from "./YourPosts";
import YourHiddenPosts from "./YourHiddenPosts";
import YourComments from "./YourComments";
import YourSavedPosts from "./YourSavedPosts";

function ProfileTabs() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList>
        <TabsTrigger className="rounded-md gap-2" value="posts">
          <NotebookPenIcon className="size-4" />
          Posts
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="comments">
          <MessageSquareIcon className="size-4" />
          Comments
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="saved">
          <BookmarkIcon className="size-4" />
          Saved
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="hidden">
          <EyeOffIcon className="size-4" />
          Hidden
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="upvotes">
          <ArrowBigUpDashIcon className="size-4" />
          Upvotes
        </TabsTrigger>
        <TabsTrigger className="rounded-md gap-2" value="downvotes">
          <ArrowBigDownDashIcon className="size-4" />
          Downvotes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <YourPosts />
      </TabsContent>
      <TabsContent value="comments">
        <YourComments />
      </TabsContent>
      <TabsContent value="hidden">
        <YourHiddenPosts />
      </TabsContent>
      <TabsContent value="saved">
        <YourSavedPosts />
      </TabsContent>
      <TabsContent value="upvotes">
        <YourHiddenPosts />
      </TabsContent>
      <TabsContent value="downvotes">
        <YourHiddenPosts />
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTabs;
