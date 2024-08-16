import { useParams } from "react-router-dom";

import useContentType from "@/hooks/useContentType";

import { EditPage } from "./edit";
import { ListPage } from "./list";

export function ListOrSingletonPage() {
  const { resourceId } = useParams<"resourceId">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    contentType.isSingleton ? (
      <EditPage />
    ) : (
      <ListPage />
    )
  ) : null;
}
