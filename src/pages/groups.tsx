import { useTranslate } from "@refinedev/core";

import useContentType from "@/hooks/useContentType";
import { Main } from "@/pages/list";

export function GroupsPage() {
  const resourceId = "groups";
  const contentType = useContentType(resourceId!);
  const translate = useTranslate();

  return contentType && resourceId ? (
    <Main
      resourceId={resourceId}
      contentType={contentType}
      title={translate("pages.groups.title")}
    />
  ) : null;
}
