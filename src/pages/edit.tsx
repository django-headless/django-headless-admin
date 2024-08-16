import { useOne, useTranslate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { ContentFields } from "@/components/content-fields";
import { Inlines } from "@/components/inlines";
import { Button } from "@/components/ui/button";
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
      <div className="max-w-screen-lg mx-auto w-full space-y-12">
        <Main resourceId={resourceId} id={id} contentType={contentType} />
        {id && <Inlines contentType={contentType} />}
      </div>
    </div>
  ) : null;
}

function Main({
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
  const resourceNamePlural =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const { data, isError, isLoading } = useOne({
    resource: resourceId,
    id,
    meta: { isSingleton: contentType.isSingleton },
  });
  const { mutate } = useUpdate();

  useTitle(translate("pages.edit.document_title", { resourceName }));

  const form = useForm();

  const onSubmit = useCallback((values: any) => {
    mutate({
      resource: resourceId,
      id,
      values,
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link
              to={`/content/${resourceId}`}
              className="text-sm hover:underline"
            >
              {resourceNamePlural}
            </Link>
            <h1 className="text-2xl font-semibold truncate">
              {form.watch("__str__")}
            </h1>
          </div>
          <Button loading={form.formState.isSubmitting} type="submit">
            {translate("common.save")}
          </Button>
        </div>

        <div className="bg-white p-8 border rounded">
          <ContentFields contentType={contentType} />
        </div>
      </form>
    </Form>
  );
}
