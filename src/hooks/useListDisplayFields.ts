import * as R from "ramda";
import { useMemo } from "react";

import { ContentType } from "@/types";

export default function useListDisplayFields(contentType: ContentType) {
  return useMemo(
    () =>
      R.pipe(
        Object.entries,
        R.filter(([key, _]) => contentType.admin.listDisplay.includes(key)),
      )(contentType.fields ?? {}),
    [contentType],
  );
}
