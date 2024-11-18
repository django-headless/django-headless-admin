import { useCreate, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as R from "ramda";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

import { ContentFields } from "@/components/content-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminFields } from "@/hooks/useAdminFields";
import useContentType from "@/hooks/useContentType";
import { ContentType } from "@/types";

const ITEM_RESOURCE_ID = "media-library/items";

export function MediaLibraryModal({
  folder,
  children,
}: {
  folder?: string;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const translate = useTranslate();
  const contentType = useContentType(ITEM_RESOURCE_ID);

  return contentType ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen-lg max-h-[calc(100dvh-80px)] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-center">
            {translate("components.inline_modal.create_title", {
              resourceName: contentType.verboseName,
            })}
          </DialogTitle>
        </DialogHeader>
        <Main
          contentType={contentType}
          prefilledValues={{ folder, crop: {} }}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  ) : null;
}

function Main({
  contentType,
  prefilledValues,
  closeDialog,
}: {
  contentType: ContentType;
  resourceId: string;
  id: string | null;
  prefilledValues?: Record<string, any | null>;
  closeDialog: VoidFunction;
}) {
  const fieldNames = useAdminFields(contentType);
  const form = useForm({
    defaultValues: {
      ...R.mapObjIndexed(R.propOr(null, "default"), contentType.fields),
      ...prefilledValues,
    },
  });

  const { mutateAsync: create } = useCreate();

  const onSubmit = useCallback(async (values: any) => {
    const fileType = R.cond([
      [R.startsWith("image/"), R.always("image")],
      [R.startsWith("video/"), R.always("video")],
      [R.startsWith("audio/"), R.always("audio")],
      [R.T, R.always("file")],
    ])(values.file?.type);

    try {
      await create({
        resource: ITEM_RESOURCE_ID,
        values: {
          ...values,
          type: fileType,
        },
        meta: {
          contentType,
        },
      });
      closeDialog();
    } catch (e) {}
  }, []);

  return (
    <Form {...form}>
      <ScrollArea className="flex-1 flex-col flex">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 max-w-screen-md mx-auto">
            <ContentFields
              contentType={contentType}
              fieldNames={R.without(
                prefilledValues ? Object.keys(prefilledValues) : [],
                fieldNames,
              )}
            />
          </div>
        </form>
      </ScrollArea>
      <DialogFooter className="p-4 border-t">
        <ActionButtons onSave={() => form.handleSubmit(onSubmit)()} />
      </DialogFooter>
    </Form>
  );
}

function ActionButtons({ onSave }: { onSave: VoidFunction }) {
  const translate = useTranslate();
  const form = useFormContext();

  return (
    <div className="flex items-center gap-4">
      <DialogClose asChild>
        <Button variant="outline">{translate("common.cancel")}</Button>
      </DialogClose>
      <Button loading={form.formState.isSubmitting} onClick={() => onSave()}>
        {translate("common.create")}
      </Button>
    </div>
  );
}
