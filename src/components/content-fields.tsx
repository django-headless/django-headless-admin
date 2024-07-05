import { Textarea, TextInput } from "@mantine/core";
import React, { useId, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { useAdminFields } from "@/hooks/useAdminFields";
import { ContentType, ContentTypeField, FieldType } from "@/types";

/**
 * Renders a content type's admin fields. This component
 * should always be rendered inside a `react-hook-form` `FormProvider`.
 */
export function ContentFields({ contentType }: { contentType: ContentType }) {
  const fields = useAdminFields(contentType);

  return (
    <div className="space-y-3">
      {fields.map((field) =>
        Array.isArray(field) ? (
          <div
            key={field.join()}
            className="flex items-end gap-3 justify-evenly"
          >
            {field.map((f) => (
              <ContentField key={f} field={contentType.fields[f]} />
            ))}
          </div>
        ) : (
          <ContentField
            key={field}
            name={field}
            field={contentType.fields[field]}
          />
        ),
      )}
    </div>
  );
}

export function ContentField({
  name,
  field,
}: {
  name: string;
  field: ContentTypeField;
}) {
  const element = useMemo(() => {
    switch (field.type) {
      case FieldType.CharField:
        return <TextInput />;
      case FieldType.HTMLField:
        return <Textarea />;
      default:
        return import.meta.env.DEV ? (
          <div className="text-sm font-medium text-gray-500">
            Unable to render fields of type {field.type}
          </div>
        ) : null;
    }
  }, [field.type]);

  return (
    element && <FormItem element={element} name={name} label={field.label} />
  );
}

export function FormItem({
  element,
  name,
  label,
}: {
  element: React.ReactElement;
  name: string;
  label: string;
}) {
  const methods = useFormContext();
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="font-semibold text-sm text-gray-800">
        {label}
      </label>
      {React.cloneElement(element, { ...methods.register(name), id })}
    </div>
  );
}
