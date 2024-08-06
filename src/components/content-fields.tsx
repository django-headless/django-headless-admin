import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { ChoiceField } from "@/components/ui/choice-field";
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
import { MediaField } from "@/components/ui/media-field";
import { RichTextField } from "@/components/ui/rich-text";
import { Textarea } from "@/components/ui/textarea";
import { useAdminFields } from "@/hooks/useAdminFields";
import { ContentType, ContentTypeField, FieldType } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Renders a content type's admin fields. This component
 * should always be rendered inside a `Form` component.
 */
export function ContentFields({ contentType }: { contentType: ContentType }) {
  const fieldNames = useAdminFields(contentType);

  return (
    <div className="space-y-4">
      {fieldNames.map((nameOrNames) =>
        Array.isArray(nameOrNames) ? (
          <div
            key={nameOrNames.join()}
            className="flex items-end gap-2 justify-evenly"
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
  hideLabel = false,
}: {
  name: string;
  fieldConfig: ContentTypeField;
  hideLabel?: boolean;
}) {
  const form = useFormContext();
  const element = useMemo(() => {
    switch (fieldConfig.type) {
      case FieldType.CharField:
        return fieldConfig.choices ? (
          <ChoiceField options={fieldConfig.choices} />
        ) : (
          <Input />
        );
      case FieldType.PositiveIntegerField:
        return <Input type="number" min={0} />;
      case FieldType.EmailField:
        return <Input type="email" />;
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
      case FieldType.MediaField:
        return <MediaField clearable={!fieldConfig.validation?.required} />;
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
          <FormItem className="flex items-start space-y-0">
            {!hideLabel && (
              <div className="w-[200px]">
                <FormLabel
                  className={cn({
                    "font-normal text-secondary-foreground":
                      !fieldConfig.validation.required,
                  })}
                >
                  {fieldConfig.label}
                </FormLabel>
              </div>
            )}
            <div className="flex-1">
              <FormControl>{React.cloneElement(element, field)}</FormControl>
              {fieldConfig.helpText && (
                <FormDescription>{fieldConfig.helpText}</FormDescription>
              )}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    )
  );
}
