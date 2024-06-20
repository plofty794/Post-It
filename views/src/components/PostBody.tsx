import {
  EditorProvider,
  BubbleMenu,
  useCurrentEditor,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import useCreatePost from "@/hooks/auth/posts/useCreatePost";
import MenuBar from "./MenuBar";
import useEditPost from "@/hooks/auth/posts/useEditPost";

const limit = 1500;

// define your extension array
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  CharacterCount.configure({
    limit,
  }),
];

function PostBody({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState("");

  return (
    <EditorProvider
      editable
      slotBefore={<BlogTitle title={title} setTitle={setTitle} />}
      slotAfter={<Footer title={title} setTitle={setTitle} setOpen={setOpen} />}
      extensions={extensions}
    >
      <BubbleMenu tippyOptions={{ duration: 100 }}>
        <Card className="w-max flex items-center gap-1 p-2">
          <MenuBar />
        </Card>
      </BubbleMenu>
    </EditorProvider>
  );
}

export function BlogTitle({
  title,
  setTitle,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <Label htmlFor="name" className="text-left">
            Title <span className="text-red-600 text-base">*</span>
          </Label>
          <Badge
            variant={`${title.length > 150 ? "destructive" : "secondary"}`}
          >
            {title.length} / 150 characters
          </Badge>
        </div>
        <Input
          autoFocus
          id="name"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What post title is on your mind?"
          className="col-span-3"
        />
      </div>
      <div className="mt-4 w-full flex justify-between items-center">
        <Label className="text-left">
          Body <span className="text-red-600 text-base">*</span>
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge>How to use?</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Highlight the text to show the rich text editor
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}

export function Footer({
  title,
  setTitle,
  setOpen,
  postID,
}: {
  title: string;
  postID?: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { editor } = useCurrentEditor();

  return postID ? (
    <EditPost setOpen={setOpen} title={title} editor={editor} postID={postID} />
  ) : (
    <CreatePost
      setOpen={setOpen}
      setTitle={setTitle}
      title={title}
      editor={editor}
    />
  );
}

function CreatePost({
  title,
  setTitle,
  setOpen,
  editor,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor | null;
}) {
  const { mutate, isSuccess } = useCreatePost();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess, setOpen]);

  function createPost() {
    mutate({ title, body: editor?.getHTML() });
    setTitle("");
    editor?.commands.clearContent();
  }

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        <Badge
          variant={
            editor?.storage.characterCount.characters() >= limit
              ? "destructive"
              : "secondary"
          }
          className="w-max"
        >
          {editor?.storage.characterCount.characters()}/{limit} characters
        </Badge>
        <Badge variant={"secondary"} className="w-max">
          {editor?.storage.characterCount.words()} words
        </Badge>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          disabled={
            !editor?.getText().length ||
            editor?.storage.characterCount.characters() >= limit ||
            !title.length ||
            title.length > 150
          }
          variant={"outline"}
        >
          Save as draft
        </Button>
        <Button
          onClick={() => createPost()}
          disabled={
            !editor?.getText().length ||
            editor?.storage.characterCount.characters() >= limit ||
            !title.length ||
            title.length > 150
          }
          variant={"secondary"}
        >
          Post
        </Button>
      </div>
    </>
  );
}

function EditPost({
  title,
  postID,
  setOpen,
  editor,
}: {
  title: string;
  postID?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor | null;
}) {
  const { mutate, isSuccess } = useEditPost();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess, setOpen]);

  function editPost() {
    mutate({ title, body: editor?.getHTML(), postID });
  }

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        <Badge
          variant={
            editor?.storage.characterCount.characters() >= limit
              ? "destructive"
              : "secondary"
          }
          className="w-max"
        >
          {editor?.storage.characterCount.characters()}/{limit} characters
        </Badge>
        <Badge variant={"secondary"} className="w-max">
          {editor?.storage.characterCount.words()} words
        </Badge>
      </div>
      <Button
        className="w-max ml-auto"
        onClick={() => editPost()}
        disabled={
          !editor?.isFocused ||
          editor?.isEmpty ||
          editor?.storage.characterCount.characters() >= limit ||
          !title.length ||
          title.length > 150
        }
        variant={"secondary"}
      >
        Save changes
      </Button>
    </>
  );
}

export default PostBody;
