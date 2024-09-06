import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { ContentFieldDisplay } from "@/components/content-field-display";
import { ChoiceField } from "@/components/ui/choice-field";
import { DatePicker } from "@/components/ui/date-picker";
import { FileField } from "@/components/ui/file-field";
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
import { ManyToManyField } from "@/components/ui/m2m-field";
import { ManyMediaField } from "@/components/ui/many-media-field";
import { MediaField } from "@/components/ui/media-field";
import { MultipleChoiceField } from "@/components/ui/multiple-choice-field";
import { RichTextField } from "@/components/ui/rich-text";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerInput } from "@/components/ui/time-picker";
import { useAdminFields } from "@/hooks/useAdminFields";
import { ContentType, ContentTypeField, FieldType } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Renders a content type's admin fields. This component
 * should always be rendered inside a `Form` component.
 */
export function ContentFields({
  contentType,
  exclude = [],
}: {
  contentType: ContentType;
  // Force the exclusion of certain field names which
  // is used by inlines to exclude known field values.
  exclude?: string[];
}) {
  const fieldNames = useAdminFields(contentType);
  const noUpdatePermission = !contentType.admin?.permissions.change;

  return (
    <div className="space-y-6">
      {fieldNames.map((nameOrNames) =>
        Array.isArray(nameOrNames) ? (
          <div
            key={nameOrNames.join()}
            className="flex items-end gap-2 justify-evenly"
          >
            {nameOrNames.map(
              (name) =>
                !exclude.includes(name) && (
                  <ContentField
                    key={name}
                    name={name}
                    readOnly={
                      (noUpdatePermission ||
                        contentType.admin?.readonlyFields.includes(name)) ??
                      false
                    }
                    fieldConfig={contentType.fields[name]}
                  />
                ),
            )}
          </div>
        ) : (
          !exclude.includes(nameOrNames) && (
            <ContentField
              key={nameOrNames}
              name={nameOrNames}
              readOnly={
                (noUpdatePermission ||
                  contentType.admin?.readonlyFields.includes(nameOrNames)) ??
                false
              }
              fieldConfig={contentType.fields[nameOrNames]}
            />
          )
        ),
      )}
    </div>
  );
}

export function ContentField({
  name,
  fieldConfig,
  readOnly,
}: {
  name: string;
  fieldConfig: ContentTypeField;
  readOnly: boolean;
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
      case FieldType.MultipleChoiceField:
        return <MultipleChoiceField options={fieldConfig.choices ?? []} />;
      case FieldType.PositiveIntegerField:
      case FieldType.PositiveSmallIntegerField:
        return <Input type="number" min={0} />;
      case FieldType.IntegerField:
      case FieldType.DecimalField:
        return <Input type="number" />;
      case FieldType.EmailField:
        return <Input type="email" />;
      case FieldType.DateField:
        return <DatePicker />;
      case FieldType.TimeField:
        return <TimePickerInput picker="12hours" />;
      case FieldType.URLField:
        return <Input type="url" />;
      case FieldType.URLPathField:
        return <Input placeholder="/" />;
      case FieldType.TextField:
        return <Textarea rows={8} />;
      case FieldType.HTMLField:
        return <RichTextField />;
      case FieldType.FlexField:
        return <FlexField schema={fieldConfig.schema!} />;
      case FieldType.ForeignKey:
        return <ForeignKeyField resourceId={fieldConfig.resourceId!} />;
      case FieldType.ManyToManyField:
        return <ManyToManyField resourceId={fieldConfig.resourceId!} />;
      case FieldType.MediaField:
        return <MediaField clearable={!fieldConfig.validation?.required} />;
      case FieldType.ManyMediaField:
        return <ManyMediaField />;
      case FieldType.FileField:
        return <FileField type={fieldConfig.validation?.fileType || "file"} />;
      default:
        return import.meta.env.DEV ? (
          <div className="text-sm font-medium text-gray-500">
            Unable to render fields of type {fieldConfig.type}
          </div>
        ) : null;
    }
  }, [fieldConfig]);

  return (
    element && (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-start space-y-0">
            <div className="w-[200px] shrink-0">
              <FormLabel
                className={cn({
                  "font-normal text-secondary-foreground":
                    !fieldConfig.validation.required,
                })}
              >
                {fieldConfig.label}
              </FormLabel>
            </div>
            <div className="flex-1">
              {readOnly ? (
                <ContentFieldDisplay
                  contentTypeField={fieldConfig}
                  value={form.watch(name)}
                />
              ) : (
                <>
                  <FormControl>
                    {React.cloneElement(element, field)}
                  </FormControl>
                  {fieldConfig.helpText && (
                    <FormDescription>{fieldConfig.helpText}</FormDescription>
                  )}
                </>
              )}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    )
  );
}
