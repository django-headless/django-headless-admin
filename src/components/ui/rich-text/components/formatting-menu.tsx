import { useCurrentEditor } from "@tiptap/react";
import {
  PiArrowArcLeftBold,
  PiArrowArcRightBold,
  PiListBold,
  PiListBulletsBold,
  PiTextBBold,
  PiTextItalicBold,
  PiTextStrikethroughBold,
  PiTextUnderlineBold,
} from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

import HeadingMenu from "./heading-menu";

export function FormattingMenu() {
  const { editor } = useCurrentEditor();

  return (
    editor && (
      <div className="border-b flex items-center gap-2 p-1 overflow-x-auto overflow-y-hidden">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <PiArrowArcLeftBold />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <PiArrowArcRightBold />
        </Button>

        <div className="w-[140px]">
          <HeadingMenu />
        </div>

        <Toggle
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
        >
          <PiTextBBold />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
        >
          <PiTextItalicBold />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("underline")}
          onPressedChange={() =>
            editor?.chain().focus().toggleUnderline().run()
          }
        >
          <PiTextUnderlineBold />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("strike")}
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
        >
          <PiTextStrikethroughBold />
        </Toggle>

        <Separator orientation="vertical" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <PiListBold />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <PiListBulletsBold />
        </Button>

        <Separator orientation="vertical" />
      </div>
    )
  );
}
