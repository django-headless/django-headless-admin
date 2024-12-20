import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import * as R from "ramda";
import { PiCheckCircleBold, PiFile, PiXCircleBold } from "react-icons/pi";
import { Link } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { type ContentTypeField, FieldType } from "@/types";

/**
 * Renders a readonly view of a content field.
 */
export function ContentFieldDisplay({
  contentTypeField,
  config,
  value,
  item,
  canLink = true,
}: {
  contentTypeField: ContentTypeField;
  config?: any;
  /*
   * The value of the field.
   */
  value: any;
  /*
   * The full content item object.
   */
  item: any;
  canLink?: boolean;
}) {
  const fieldType = contentTypeField.type;

  if (R.isNil(value)) {
    return "";
  }

  switch (fieldType) {
    case FieldType.ForeignKey:
    case FieldType.OneToOneField:
      return value ? (
        canLink ? (
          <Link
            className="hover:underline"
            to={`/content/${contentTypeField.resourceId}/${value.id}`}
          >
            {value.__str__}
          </Link>
        ) : (
          value.__str__
        )
      ) : null;
    case FieldType.DateTimeField:
      return (
        <div className="text-sm whitespace-nowrap">
          {dayjs(value).fromNow()}
        </div>
      );
    case FieldType.DateField:
      return (
        <div className="font-medium text-sm text-muted-foreground">
          {dayjs(value).format("L")}
        </div>
      );
    case FieldType.MediaField:
      return value.type === "image" ? (
        <Image
          src={value.file}
          alt=""
          className="size-12 object-cover rounded-md"
          width={200}
        />
      ) : (
        <div className="size-12 rounded-md bg-accent flex items-center justify-center select-none">
          <PiFile />
        </div>
      );
    case FieldType.FileField:
      // TODO this only applies to media library content.
      return !item.type || item.type === "image" ? (
        <Image
          src={value}
          alt=""
          className="size-12 object-cover rounded-md"
          width={200}
        />
      ) : (
        <div className="size-12 rounded-md bg-accent flex items-center justify-center select-none">
          <PiFile />
        </div>
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
    case FieldType.MultipleChoiceField:
      return (
        <div className="text-sm">
          {R.pipe(R.sortBy(R.identity), R.join(", "))(value ?? [])}
        </div>
      );
    case FieldType.CropField:
      return (
        <div>
          {value
            ? `${value.x}x, ${value.y}y, ${value.width}w, ${value.height}h`
            : ""}
        </div>
      );
    default:
      return (
        <div className="break-words text-sm">
          {contentTypeField.choices
            ? contentTypeField.choices.find(([key]) => key === value)?.[1]
            : value}
        </div>
      );
  }
}
