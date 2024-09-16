import * as R from "ramda";
import { useMemo } from "react";

import { ContentType, ContentTypeField } from "@/types";

export default function useListDisplayFields(contentType: ContentType) {
  return useMemo<[string, ContentTypeField][]>(
    () =>
      R.pipe(
        R.filter((field: string) => R.has(field)(contentType.fields)),
        R.map((field: string) => [field, contentType.fields[field]]),
      )(contentType.admin?.listDisplay ?? ([] as string[])) as [
        string,
        ContentTypeField,
      ][],
    [contentType],
  );
}
