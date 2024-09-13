import { useDelete, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as R from "ramda";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  PiCaretLeft,
  PiSidebarSimple,
  PiSidebarSimpleFill,
} from "react-icons/pi";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ContentFields } from "@/components/content-fields";
import { Inlines } from "@/components/inlines";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import { useAdminFields } from "@/hooks/useAdminFields";
import useContentType from "@/hooks/useContentType";
import useTitle from "@/hooks/useTitle";
import { ContentType, FieldType } from "@/types";
import { cn } from "@/utils/cn";
export function EditPage() {
  const { resourceId, id } = useParams<"resourceId" | "id">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    <EditMain resourceId={resourceId} id={id} contentType={contentType} />
  ) : null;
}

function EditMain({
  contentType,
  resourceId,
  id = null,
}: {
  contentType: ContentType;
  resourceId: string;
  id?: string | null;
}) {
  const translate = useTranslate();
  const resourceName = contentType.verboseName;
  const isSingleton = contentType.isSingleton ?? false;
  const [sidebar, setSidebar] = useState(false);
  const fieldNames = useAdminFields(contentType);
  const ref = useRef<ImperativePanelHandle>(null);

  useTitle(translate("pages.edit.document_title", { resourceName }));

  return (
    <EditForm contentType={contentType} id={id}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="relative flex-1 overflow-y-auto h-dvh">
            <Header
              isSingleton={isSingleton}
              resourceId={resourceId}
              contentType={contentType}
              setSidebar={(s) => setSidebar(s)}
              sidebar={sidebar}
            />

            <div className="max-w-screen-md mx-auto w-full pt-12 lg:w-2/3 z-10 relative">
              <ContentFields
                contentType={contentType}
                fieldNames={fieldNames}
              />
            </div>
            {id && <Inlines contentType={contentType} />}
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          onDoubleClick={() => ref.current?.resize(20)}
        />

        {sidebar && (
          <ResizablePanel
            ref={ref}
            className="flex flex-col"
            minSize={10}
            defaultSize={20}
            maxSize={50}
          >
            <Sidebar
              contentType={contentType}
              resourceId={resourceId}
              id={id}
            />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </EditForm>
  );
}

function EditForm({
  id = null,
  children,
  contentType,
}: {
  id?: string | null;
  children: React.ReactElement;
  contentType: ContentType;
}) {
  const translate = useTranslate();
  const resourceId = contentType.resourceId;
  const isSingleton = contentType.isSingleton;
  // Check if content type contains a file field, so we
  // can tell the dataprovider to use multipart.
  const hasFileField = Object.values(contentType.fields).some(
    R.whereEq({ type: FieldType.FileField }),
  );
  const readOnlyFields = contentType.admin?.readonlyFields ?? [];

  const form = useForm({
    refineCoreProps: {
      action: id ? "edit" : "create",
      resource: resourceId,
      id: id ?? undefined,
      meta: { isSingleton, hasFileField, readOnlyFields },
      successNotification() {
        return {
          message: translate("notifications.success"),
          description: translate("notifications.edit_success", {
            resource: contentType.verboseName,
          }),
          type: "success",
        };
      },
      errorNotification() {
        return {
          message: translate("notifications.error"),
          description: translate("notifications.edit_error", {
            resource: contentType.verboseName,
          }),
          type: "error",
        };
      },
    },
  });

  if (form.refineCore.formLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (form.refineCore.query?.isError) {
    return (
      <div className="flex items-center justify-center py-12">
        Something went wrong!
      </div>
    );
  }

  return <Form {...form}>{children}</Form>;
}

function Header({
  isSingleton,
  resourceId,
  contentType,
  setSidebar,
  sidebar,
}: {
  isSingleton: boolean;
  resourceId: string;
  contentType: ContentType;
  sidebar: boolean;
  setSidebar(sidebar: boolean): void;
}) {
  const resourceNamePlural =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const form = useFormContext();
  const translate = useTranslate();

  return (
    <div className="flex items-center justify-between lg:sticky top-0 left-0 right-0 lg:p-4 mb-12 lg:mb-0 z-20 bg-gradient-to-b from-white/95 via-white/75 to-white/0">
      <div className="w-full flex items-center gap-1">
        <Link
          to={isSingleton ? "/" : `/content/${resourceId}`}
          className={cn(
            "inline-flex items-center gap-1",
            buttonVariants({ variant: "ghost" }),
          )}
        >
          <PiCaretLeft />
          <span>
            {isSingleton ? translate("common.back") : resourceNamePlural}
          </span>
        </Link>
        <span className="select-none opacity-20">{"/"}</span>
        <h1 className="px-2 text-sm text-left font-medium line-clamp-1 max-w-md">
          {isSingleton ? resourceNamePlural : form.watch("__str__")}
        </h1>
      </div>
      <div className="flex items-center justify-end gap-2 lg:w-1/6">
        {contentType.admin?.permissions.change && (
          <Button
            loading={form.formState.isSubmitting}
            {...form.saveButtonProps}
          >
            {translate("common.save")}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebar(!sidebar)}
        >
          {sidebar ? (
            <PiSidebarSimpleFill className="rotate-180 origin-center size-5" />
          ) : (
            <PiSidebarSimple className="rotate-180 origin-center size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

function Sidebar({
  contentType,
  resourceId,
  id,
}: {
  contentType: ContentType;
  resourceId: string;
  id?: string | null;
}) {
  const translate = useTranslate();
  const resourceName = contentType.verboseName;
  const navigate = useNavigate();
  const { mutateAsync: remove } = useDelete();
  const fieldNames = useAdminFields(contentType, { sidebar: true });

  return (
    <div className="overflow-y-auto w-full flex-1 flex flex-col bg-muted/50">
      <div className="flex-1 p-4">
        <ContentFields
          layout="vertical"
          contentType={contentType}
          fieldNames={fieldNames}
        />
      </div>
      <div className="p-4 border-t">
        {contentType.admin?.permissions.delete && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={async () => {
              if (window.confirm(translate("common.are_you_sure"))) {
                try {
                  await remove({
                    resource: resourceId,
                    id: id ?? "<SINGLETON>",
                  });
                  navigate(`/content/${resourceId}`);
                } catch (e) {}
              }
            }}
          >
            {translate("pages.edit.delete_document", { resourceName })}
          </Button>
        )}
      </div>
    </div>
  );
}
