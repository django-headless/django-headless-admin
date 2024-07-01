import { useMemo } from "react";

import { ContentType } from "@/types";

export default function useListDisplayLinks(contentType: ContentType) {
  return useMemo<string[]>(
    () => contentType.admin.listDisplayLinks,
    [contentType],
  );
}
