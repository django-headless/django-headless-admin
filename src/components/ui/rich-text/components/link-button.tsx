import { useTranslate } from "@refinedev/core";
import type { Editor } from "@tiptap/core";
import * as R from "ramda";
import React, { useState } from "react";
import { PiLinkBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LinkButton: React.FC = ({ editor }: { editor: Editor }) => {
  const translate = useTranslate();
  const [edit, setEdit] = useState(false);
  const hasSelection = !R.isNil(editor.view.state.selection.content().toJSON());

  return (
    <>
      {edit && (
        <LinkEditDialog editor={editor} onClose={() => setEdit(false)} />
      )}
      <Tooltip>
        <TooltipContent>
          {editor.isActive("link")
            ? translate("components.rich_text_editor.update_link")
            : translate("components.rich_text_editor.set_link")}
        </TooltipContent>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            disabled={!hasSelection && !editor.isActive("link")}
            onClick={() => setEdit(true)}
          >
            <PiLinkBold />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </>
  );
};

const LinkEditDialog = ({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: VoidFunction;
}) => {
  const translate = useTranslate();
  const [value, setValue] = useState(editor.getAttributes("link").href ?? "");
  const isEdit = editor.isActive("link");

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? translate("components.rich_text_editor.update_link")
              : translate("components.rich_text_editor.set_link")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <Input
            placeholder="https://"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          {isEdit && (
            <Button
              variant="destructive"
              className="mr-auto"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                onClose();
              }}
            >
              {translate("components.rich_text_editor.remove_link")}
            </Button>
          )}
          <Button variant="ghost" onClick={() => onClose()}>
            {translate("common.cancel")}
          </Button>
          <Button
            onClick={() => {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: value })
                .run();
              onClose();
            }}
          >
            {isEdit
              ? translate("components.rich_text_editor.update_link")
              : translate("components.rich_text_editor.set_link")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkButton;
