import * as R from "ramda";

import { type ContentType, type ContentTypeField, FieldType } from "@/types";

/**
 * Normalizes a content object based on its content type.
 */
export function normalize(
  obj: Record<string, unknown>,
  contentType: ContentType,
): Record<string, unknown> {
  return R.mapObjIndexed((value, key) => {
    const info: ContentTypeField = contentType.fields[key];

    if (!info) {
      return value;
    }
    /*
     * Integers should be cast to numbers unless
     * it's an empty string which should be cast to null.
     */
    if (
      [
        FieldType.IntegerField,
        FieldType.PositiveIntegerField,
        FieldType.PositiveSmallIntegerField,
      ].includes(info.type)
    ) {
      return value === "" || R.isNil(value) ? null : Number(value);
    }

    return value;
  })(obj);
}
