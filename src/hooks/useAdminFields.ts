import * as R from "ramda";
import { useMemo } from "react";

import { ContentType } from "@/types";

/**
 * Returns the fields that should be displayed in the edit and create forms.
 * This list is based on the admin's `fields` and `exclude` properties. If neither
 * are defined, the list will contain all editable fields of the content type.
 */
export function useAdminFields(contentType: ContentType) {
  return useMemo(() => {
    if (contentType.admin.fields) {
      return contentType.admin.fields;
    }

    const fields = Object.entries(contentType.fields).reduce(
      (acc, [key, value]) => (value.editable ? [...acc, key] : acc),
      [] as string[],
    );

    if (contentType.admin.exclude) {
      return R.without(contentType.admin.exclude, fields);
    }

    return fields;
  }, [contentType]);
}
