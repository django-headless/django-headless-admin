import { useOne, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { ContentFields } from "@/components/content-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import useContentType from "@/hooks/useContentType";
import useTitle from "@/hooks/useTitle";
import { ContentType } from "@/types";

export function EditPage() {
  const { apiId, id } = useParams<"apiId" | "id">();
  const contentType = useContentType(apiId!);

  return contentType && apiId && id ? (
    <Main apiId={apiId} id={id} contentType={contentType} />
  ) : null;
}

function Main({
  contentType,
  apiId,
  id,
}: {
  contentType: ContentType;
  apiId: string;
  id: string;
}) {
  const translate = useTranslate();
  const resourceName = contentType.verboseName;
  const resourceNamePlural =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const { data, isError, isLoading } = useOne({ resource: apiId, id });

  useTitle(translate("pages.edit.document_title", { resourceName }));

  const form = useForm();

  const onSubmit = useCallback((values: any) => {
    console.log(values);
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
        <div className="p-16">
          <div className="max-w-screen-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Link
                  to={`/content/${apiId}`}
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
          </div>
        </div>
      </form>
    </Form>
  );
}
