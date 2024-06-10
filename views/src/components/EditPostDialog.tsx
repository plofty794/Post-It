import { EditorProvider, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import { Card } from "./ui/card";
import { useState } from "react";
import MenuBar from "./MenuBar";
import { BlogTitle, Footer } from "./PostBody";

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

function EditPostDialog({
  postID,
  setOpen,
  postTitle,
  postContent,
}: {
  postID: string;
  postTitle?: string;
  postContent?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState(postTitle ?? "");

  return (
    <EditorProvider
      editable
      content={postContent}
      slotBefore={<BlogTitle title={title} setTitle={setTitle} />}
      slotAfter={
        <Footer
          postID={postID}
          title={title}
          setTitle={setTitle}
          setOpen={setOpen}
        />
      }
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

export default EditPostDialog;
