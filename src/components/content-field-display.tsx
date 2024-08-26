import dayjs from "dayjs";

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

  switch (fieldType) {
    case FieldType.ForeignKey:
      return value;
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
    case FieldType.FileField:
      return (
        <img src={value} alt="" className="size-12 object-cover rounded-md" />
      );
    default:
      return value;
  }
}
