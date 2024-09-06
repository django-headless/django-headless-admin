import dayjs from "dayjs";
import * as R from "ramda";
import { Link } from "react-router-dom";

import { ContentTypeField, FieldType } from "@/types";

/**
 * Renders a readonly view of a content field.
 */
export function ContentFieldDisplay({
  contentTypeField,
  value,
}: {
  contentTypeField: ContentTypeField;
  value: any;
}) {
  const fieldType = contentTypeField.type;

  if (R.isNil(value)) {
    return "";
  }

  switch (fieldType) {
    case FieldType.ForeignKey:
      return value ? (
        <Link
          className="hover:underline"
          to={`/content/${contentTypeField.resourceId}/${value.id}`}
        >
          {value.__str__}
        </Link>
      ) : null;
    case FieldType.DateTimeField:
      return (
        <div className="font-medium text-sm text-muted-foreground">
          {dayjs(value).format("L LT")}
        </div>
      );
    case FieldType.DateField:
      return (
        <div className="font-medium text-sm text-muted-foreground">
          {dayjs(value).format("L")}
        </div>
      );
    case FieldType.MediaField:
      return (
        <img
          src={value.__str__}
          alt=""
          className="size-12 object-cover rounded-md"
        />
      );
    case FieldType.FileField:
      return (
        <img src={value} alt="" className="size-12 object-cover rounded-md" />
      );
    default:
      return value;
  }
}
