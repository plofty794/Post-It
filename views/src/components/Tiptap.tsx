import { EditorProvider, BubbleMenu, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Document from "@tiptap/extension-document";
import CharacterCount from "@tiptap/extension-character-count";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  BoldIcon,
  Circle,
  Code2Icon,
  CodeIcon,
  Heading,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "./ui/badge";
import useCreatePost from "@/hooks/auth/useCreatePost";

const limit = 1500;

// define your extension array
const extensions = [
  Document,
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
  Text,
  Code,
];

const Tiptap = () => {
  const [title, setTitle] = useState("");

  return (
    <EditorProvider
      slotBefore={<BlogTitle title={title} setTitle={setTitle} />}
      slotAfter={<Footer title={title} />}
      extensions={extensions}
    >
      <BubbleMenu tippyOptions={{ duration: 100 }}>
        <Card className="w-max flex items-center gap-1 p-2">
          <MenuBar />
        </Card>
      </BubbleMenu>
    </EditorProvider>
  );
};

function BlogTitle({
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

function Footer({ title }: { title: string }) {
  const { mutate } = useCreatePost();
  const { editor } = useCurrentEditor();

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
          onClick={() => mutate({ title, body: editor?.getHTML() })}
          disabled={
            !editor?.getText().length ||
            editor?.storage.characterCount.characters() >= limit ||
            !title.length ||
            title.length > 150
          }
          variant={"outline"}
        >
          Post
        </Button>
      </div>
    </>
  );
}

function MenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <BoldIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Bold</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <ItalicIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {" "}
            <p className="text-xs">Italic</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <StrikethroughIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Strike through</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <Heading className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-max p-2">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleHeading({ level: 1 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 }) ? "is-active" : ""
                  }
                >
                  <Heading1Icon className="size-4" />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleHeading({ level: 2 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                  }
                >
                  <Heading2Icon className="size-4" />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleHeading({ level: 3 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 }) ? "is-active" : ""
                  }
                >
                  <Heading3Icon className="size-4" />
                </Button>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Headings</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <ListIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Bullet list</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              <ListOrderedIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Ordered list</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "is-active" : ""}
            >
              <CodeIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Code</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
              <Code2Icon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Code block</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              <QuoteIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Block quote</p>{" "}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => editor.chain().focus().setColor("#FFF").run()}
        className={
          editor.isActive("textStyle", { color: "#FFF" }) ? "is-active" : ""
        }
      >
        <Circle stroke="#FFF" fill="#FFF" className="size-4" />
      </Button>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        <Circle stroke="#958DF1" fill="#958DF1" className="size-4" />
      </Button>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon className="size-4" />
      </Button>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoIcon className="size-4" />
      </Button>
    </>
  );
}

export default Tiptap;
