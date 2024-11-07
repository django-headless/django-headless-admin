import "./rich-text.css";

import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import * as R from "ramda";
import React, { useEffect } from "react";

import { FormattingMenu } from "./components/formatting-menu";

const extensions = [
  StarterKit,
  Typography,
  Link.configure({ autolink: true, linkOnPaste: true, openOnClick: false }),
  Underline,
  Image.configure({
    HTMLAttributes: {
      class: "rich-text-image",
    },
  }),
];

export const RichTextField = React.forwardRef<
  React.ElementRef<"div">,
  RichtTextProps
>(function RichTextField({ value, onChange, disabled }: RichtTextProps, ref) {
  const editor = useEditor({
    extensions,
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "rich-text-field",
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });
  /*
   * Update editor state if it doesn't match
   * the current value.
   */
  useEffect(() => {
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return R.isNil(value) ? null : (
    <div
      ref={ref}
      className="border border-solid rounded-md bg-background focus-within:border-ring"
    >
      <FormattingMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
});

interface RichtTextProps {
  value?: string | null;
  onChange?(value: string): void;
  disabled?: boolean;
}
