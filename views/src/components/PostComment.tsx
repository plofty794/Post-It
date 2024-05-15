import { EditorProvider, BubbleMenu, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import MenuBar from "./MenuBar";
import useAddComment from "@/hooks/auth/useAddComment";

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
];

function PostComment({ commentID }: { commentID?: string }) {
  return (
    <EditorProvider
      slotAfter={<Footer commentID={commentID} />}
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

function Footer({ commentID }: { commentID?: string }) {
  const { editor } = useCurrentEditor();
  const { mutate } = useAddComment();

  function addComment() {
    if (editor?.getHTML == null) return;
    if (commentID) {
      mutate({ content: editor.getHTML(), commentID });
    } else {
      mutate({ content: editor.getHTML() });
    }
    editor.commands.clearContent();
  }

  return (
    <>
      <div className="flex items-center justify-end mt-2">
        <Button
          className="text-xs"
          onClick={() => addComment()}
          disabled={!editor?.getText().length}
          variant={"secondary"}
          size={"sm"}
        >
          Add comment
        </Button>
      </div>
    </>
  );
}

export default PostComment;
