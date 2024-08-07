import { useParams } from "react-router-dom";

import useContentType from "@/hooks/useContentType";

import { EditPage } from "./edit";
import { ListPage } from "./list";

export function ListOrSingletonPage() {
  const { apiId } = useParams<"apiId">();
  const contentType = useContentType(apiId!);

  return contentType && apiId ? (
    contentType.isSingleton ? (
      <EditPage />
    ) : (
      <ListPage />
    )
  ) : null;
}
