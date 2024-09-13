import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import * as R from "ramda";
import { PiCheckCircleBold, PiXCircleBold } from "react-icons/pi";
import { Link } from "react-router-dom";

import { type ContentTypeField, FieldType } from "@/types";

/**
 * Renders a readonly view of a content field.
 */
export function ContentFieldDisplay({
  contentTypeField,
  config,
  value,
}: {
  contentTypeField: ContentTypeField;
  config?: any;
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
    case FieldType.IntegerField:
    case FieldType.PositiveIntegerField:
    case FieldType.PositiveSmallIntegerField:
      return config?.format === "file_size"
        ? prettyBytes(value * 1_000)
        : value;
    case FieldType.BooleanField:
    case FieldType.NullBooleanField:
      return value ? (
        <span>
          <PiCheckCircleBold className="text-emerald-600" />
        </span>
      ) : (
        <span>
          <PiXCircleBold className="text-destructive" />
        </span>
      );
    default:
      return value;
  }
}
