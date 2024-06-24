import { useCustom } from "@refinedev/core";

import { ContentType } from "@/types";

export default function useContentTypes() {
  return useCustom<ContentType[]>({
    url: "/content-types",
  });
}
