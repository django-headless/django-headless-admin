import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { FlexField } from "@/components/ui/flex-field";
import { ForeignKeyField } from "@/components/ui/foreign-key-field";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextField } from "@/components/ui/rich-text";
import { Textarea } from "@/components/ui/textarea";
import { useAdminFields } from "@/hooks/useAdminFields";
import { ContentType, ContentTypeField, FieldType } from "@/types";

/**
 * Renders a content type's admin fields. This component
 * should always be rendered inside a `Form` component.
 */
export function ContentFields({ contentType }: { contentType: ContentType }) {
  const fieldNames = useAdminFields(contentType);

  return (
    <div className="space-y-3">
      {fieldNames.map((nameOrNames) =>
        Array.isArray(nameOrNames) ? (
          <div
            key={nameOrNames.join()}
            className="flex items-end gap-3 justify-evenly"
          >
            {nameOrNames.map((name) => (
              <ContentField
                key={name}
                name={name}
                fieldConfig={contentType.fields[name]}
              />
            ))}
          </div>
        ) : (
          <ContentField
            key={nameOrNames}
            name={nameOrNames}
            fieldConfig={contentType.fields[nameOrNames]}
          />
        ),
      )}
    </div>
  );
}

export function ContentField({
  name,
  fieldConfig,
}: {
  name: string;
  fieldConfig: ContentTypeField;
}) {
  const form = useFormContext();
  const element = useMemo(() => {
    switch (fieldConfig.type) {
      case FieldType.CharField:
        return <Input />;
      case FieldType.PositiveIntegerField:
        return <Input type="number" min={0} />;
      case FieldType.URLField:
        return <Input type="url" />;
      case FieldType.TextField:
        return <Textarea rows={8} />;
      case FieldType.HTMLField:
        return <RichTextField />;
      case FieldType.FlexField:
        return <FlexField schema={fieldConfig.schema} />;
      case FieldType.ForeignKey:
        return <ForeignKeyField resourceId={fieldConfig.resourceId} />;
      default:
        return import.meta.env.DEV ? (
          <div className="text-sm font-medium text-gray-500">
            Unable to render fields of type {fieldConfig.type}
          </div>
        ) : null;
    }
  }, [fieldConfig.type]);

  return (
    element && (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldConfig.label}</FormLabel>
            <FormControl>{React.cloneElement(element, field)}</FormControl>
            {fieldConfig.helpText && (
              <FormDescription>{fieldConfig.helpText}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  );
}
