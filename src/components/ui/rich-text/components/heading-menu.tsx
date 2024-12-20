import { useTranslate } from "@refinedev/core";
import type { Editor } from "@tiptap/core";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { getNodeType } from "../utils";

const NODE_TYPES = [
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "paragraph",
  "blockquote",
  "codeBlock",
];

const HeadingMenu: React.FC = ({ editor }: { editor: Editor }) => {
  const translate = useTranslate();
  const value = editor ? getNodeType(editor) : undefined;

  return (
    <Select
      value={value}
      onValueChange={(nodeType) => {
        const baseCommands = editor!.chain().focus().clearNodes();
        if (nodeType.startsWith("heading")) {
          baseCommands
            .setHeading({ level: Number(nodeType.at(-1)) as any })
            .run();
        }
        if (nodeType === "blockquote") {
          baseCommands.setBlockquote().run();
        }
        if (nodeType === "codeBlock") {
          baseCommands.setCodeBlock().run();
        }
        if (nodeType === "paragraph") {
          baseCommands.setParagraph().run();
        }
      }}
    >
      <SelectTrigger>
        {translate(`components.rich_text_editor.${value}`)}
      </SelectTrigger>
      <SelectContent>
        {NODE_TYPES.map((nodeType) => (
          <SelectItem key={nodeType} value={nodeType}>
            {translate(`components.rich_text_editor.${nodeType}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HeadingMenu;
