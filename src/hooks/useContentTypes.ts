import { useCustom } from "@refinedev/core";

import { ContentType } from "@/types";

export default function useContentTypes() {
  return useCustom<Record<string, ContentType>>({
    url: "/content-types",
    method: "get",
  });
}
