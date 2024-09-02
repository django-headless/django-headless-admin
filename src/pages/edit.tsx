import { useDelete, useOne, useTranslate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as R from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  PiCaretLeft,
  PiSidebarSimple,
  PiSidebarSimpleFill,
} from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ContentFields } from "@/components/content-fields";
import { Inlines } from "@/components/inlines";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import useContentType from "@/hooks/useContentType";
import useTitle from "@/hooks/useTitle";
import { ContentType, FieldType } from "@/types";
import { cn } from "@/utils/cn";

export function EditPage() {
  const { resourceId, id } = useParams<"resourceId" | "id">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    <Layout resourceId={resourceId} id={id} contentType={contentType} />
  ) : null;
}

function Layout({
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

  // Check if content type contains a file field, so we
  // can tell the dataprovider to use multipart.
  const hasFileField = Object.values(contentType.fields).some(
    R.whereEq({ type: FieldType.FileField }),
  );

  useTitle(translate("pages.edit.document_title", { resourceName }));

  return (
    <EditForm
      hasFileField={hasFileField}
      isSingleton={isSingleton}
      resourceId={resourceId}
      id={id}
    >
      <div className="flex overflow-hidden h-dvh">
        <div className="relative flex-1 overflow-y-auto">
          <Header
            isSingleton={isSingleton}
            resourceId={resourceId}
            contentType={contentType}
            setSidebar={(s) => setSidebar(s)}
            sidebar={sidebar}
          />

          <div className="max-w-screen-md mx-auto w-full pt-12 lg:w-2/3 z-10 relative">
            <ContentFields contentType={contentType} />
          </div>
          {id && <Inlines contentType={contentType} />}
        </div>
        {sidebar && (
          <Sidebar contentType={contentType} resourceId={resourceId} id={id} />
        )}
      </div>
    </EditForm>
  );
}

function EditForm({
  isSingleton,
  hasFileField,
  resourceId,
  id = null,
  children,
}: {
  isSingleton: boolean;
  hasFileField: boolean;
  resourceId: string;
  id?: string | null;
  children: React.ReactElement;
}) {
  const { data, isError, isLoading } = useOne({
    resource: resourceId,
    id,
    meta: { isSingleton },
  });
  const { mutate: update } = useUpdate();

  const form = useForm();

  const onSubmit = useCallback((values: any) => {
    update({
      resource: resourceId,
      id: id ?? "<SINGLETON>",
      values,
      meta: { isSingleton, hasFileField },
    });
  }, []);

  useEffect(() => {
    if (!isLoading && !isError) {
      form.reset(data.data);
    }
  }, [isLoading, isError, data]);

  if (isLoading) {
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
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
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
          <Button loading={form.formState.isSubmitting} type="submit">
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

  return (
    <div className="border-l overflow-y-auto flex flex-col flex-none w-80">
      <div className="flex-1"></div>
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
