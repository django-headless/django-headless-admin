import "./rich-text.css";

import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import * as R from "ramda";
import React from "react";

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
  return R.isNil(value) ? null : (
    <div
      ref={ref}
      className="border border-solid rounded-md bg-background focus-within:border-ring"
    >
      <EditorProvider
        extensions={extensions}
        content={value}
        editable={!disabled}
        onUpdate={({ editor }) => onChange?.(editor.getHTML())}
        editorProps={{
          attributes: {
            class: "rich-text-field",
          },
        }}
        slotBefore={<FormattingMenu />}
      >
        <span />
      </EditorProvider>
    </div>
  );
});

interface RichtTextProps {
  value?: string;
  onChange?(value: string): void;
  disabled?: boolean;
}
