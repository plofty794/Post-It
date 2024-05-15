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
import { useCurrentEditor } from "@tiptap/react";

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

export default MenuBar;
