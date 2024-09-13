import { useCreate, useOne, useTranslate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as R from "ramda";
import React, { useCallback, useEffect, useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { useAdminFields } from "@/hooks/useAdminFields";
import useContentType from "@/hooks/useContentType";
import { ContentType, FieldType } from "@/types";

export function InlineModal({
  resourceId,
  id,
  prefilledValues,
  children,
}: {
  resourceId: string;
  id: string | null;
  // Fields with prefilled values are not shown and cannot be edited.
  // This is used for example by inlines where the related field is
  // known and should not be changeable.
  prefilledValues?: Record<string, any | null>;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const translate = useTranslate();
  const contentType = useContentType(resourceId);
  const isCreate = R.isNil(id);

  return contentType ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen-lg max-h-[calc(100dvh-80px)] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-center">
            {translate(
              isCreate
                ? "components.inline_modal.create_title"
                : "components.inline_modal.edit_title",
              {
                resourceName: contentType.verboseName,
              },
            )}
          </DialogTitle>
        </DialogHeader>
        <Main
          resourceId={resourceId}
          contentType={contentType}
          id={id}
          prefilledValues={prefilledValues}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  ) : null;
}

function Main({
  contentType,
  resourceId,
  id,
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
  const isCreate = R.isNil(id);
  const form = useForm({
    defaultValues: prefilledValues,
  });
  const { data, isError, isLoading } = useOne({
    resource: resourceId,
    id: id ?? undefined,
    queryOptions: { enabled: !isCreate },
  });
  const { mutateAsync: update } = useUpdate();
  const { mutateAsync: create } = useCreate();

  // Check if content type contains a file field, so we
  // can tell the dataprovider to use multipart.
  const hasFileField = Object.values(contentType.fields).some(
    R.whereEq({ type: FieldType.FileField }),
  );

  const onSubmit = useCallback(
    async (values: any) => {
      try {
        await (!isCreate
          ? update({
              resource: resourceId,
              id: id,
              values,
              meta: {
                hasFileField,
              },
            })
          : create({
              resource: resourceId,
              values,
              meta: {
                hasFileField,
              },
            }));
        closeDialog();
      } catch (e) {}
    },
    [isCreate],
  );

  useEffect(() => {
    if (!isLoading && !isError) {
      form.reset({ ...data.data, ...prefilledValues });
    }
  }, [isLoading, isError, data]);

  if (isLoading && !isCreate) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        Something went wrong!
      </div>
    );
  }

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
        <ActionButtons
          isCreate={isCreate}
          onSave={() => form.handleSubmit(onSubmit)()}
        />
      </DialogFooter>
    </Form>
  );
}

function ActionButtons({
  isCreate,
  onSave,
}: {
  isCreate: boolean;
  onSave: VoidFunction;
}) {
  const translate = useTranslate();
  const form = useFormContext();

  return (
    <div className="flex items-center gap-4">
      <DialogClose asChild>
        <Button variant="outline">{translate("common.cancel")}</Button>
      </DialogClose>
      <Button loading={form.formState.isSubmitting} onClick={() => onSave()}>
        {translate(isCreate ? "common.create" : "common.save")}
      </Button>
    </div>
  );
}
