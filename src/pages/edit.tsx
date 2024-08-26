import { useDelete, useOne, useTranslate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React, { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ContentFields } from "@/components/content-fields";
import { Inlines } from "@/components/inlines";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import useContentType from "@/hooks/useContentType";
import useTitle from "@/hooks/useTitle";
import { ContentType } from "@/types";

export function EditPage() {
  const { resourceId, id } = useParams<"resourceId" | "id">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    <div className="p-16">
      <Layout resourceId={resourceId} id={id} contentType={contentType} />
    </div>
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

  useTitle(translate("pages.edit.document_title", { resourceName }));

  return (
    <div>
      <EditForm isSingleton={isSingleton} resourceId={resourceId} id={id}>
        <div>
          <Header
            isSingleton={isSingleton}
            resourceId={resourceId}
            id={id}
            contentType={contentType}
          />

          <div className="bg-white p-8 border rounded">
            <ContentFields contentType={contentType} />
          </div>
        </div>
      </EditForm>
      {id && <Inlines contentType={contentType} />}
    </div>
  );
}

function EditForm({
  isSingleton,
  resourceId,
  id = null,
  children,
}: {
  isSingleton: boolean;
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
      meta: { isSingleton },
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
  id,
}: {
  isSingleton: boolean;
  resourceId: string;
  contentType: ContentType;
  id?: string | null;
}) {
  const resourceName = contentType.verboseName;
  const resourceNamePlural =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const form = useFormContext();
  const translate = useTranslate();
  const navigate = useNavigate();
  const { mutateAsync: remove } = useDelete();

  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        {!isSingleton && (
          <Link
            to={`/content/${resourceId}`}
            className="text-sm hover:underline"
          >
            {resourceNamePlural}
          </Link>
        )}
        <h1 className="text-2xl font-semibold truncate">
          {isSingleton ? resourceNamePlural : form.watch("__str__")}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {contentType.admin?.permissions.change && (
          <Button loading={form.formState.isSubmitting} type="submit">
            {translate("common.save")}
          </Button>
        )}
        {contentType.admin?.permissions.delete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <PiDotsThreeVerticalBold />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-destructive"
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
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
