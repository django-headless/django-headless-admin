import { useTranslate } from "@refinedev/core";

import useContentType from "@/hooks/useContentType";
import { Main } from "@/pages/list";

export function ApiTokensPage() {
  const resourceId = "api-tokens";
  const contentType = useContentType(resourceId!);
  const translate = useTranslate();

  return contentType && resourceId ? (
    <Main
      resourceId={resourceId}
      contentType={contentType}
      title={translate("pages.api_tokens.title")}
    />
  ) : null;
}
