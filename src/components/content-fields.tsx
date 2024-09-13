import * as R from "ramda";
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
import { Switch } from "@/components/ui/switch";
import { TagField } from "@/components/ui/tag-field";
import { Textarea } from "@/components/ui/textarea";
import { ContentType, FieldType } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Renders a content type's admin fields. This component
 * should always be rendered inside a `Form` component.
 */
export function ContentFields({
  contentType,
  fieldNames = [],
  layout = "horizontal",
}: {
  contentType: ContentType;
  fieldNames: (string | string[])[];
  layout?: "horizontal" | "vertical";
}) {
  const noUpdatePermission = !contentType.admin?.permissions.change;

  return (
    <div className="space-y-6">
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
                contentType={contentType}
                layout={layout}
                readOnly={
                  (noUpdatePermission ||
                    contentType.admin?.readonlyFields.includes(name)) ??
                  false
                }
              />
            ))}
          </div>
        ) : (
          <ContentField
            key={nameOrNames}
            name={nameOrNames}
            contentType={contentType}
            layout={layout}
            readOnly={
              (noUpdatePermission ||
                contentType.admin?.readonlyFields.includes(nameOrNames)) ??
              false
            }
          />
        ),
      )}
    </div>
  );
}

export function ContentField({
  name,
  readOnly,
  contentType,
  layout,
}: {
  name: string;
  contentType: ContentType;
  readOnly: boolean;
  layout: "horizontal" | "vertical";
}) {
  const form = useFormContext();
  const fieldConfig = contentType.fields[name];
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
        return <Input />;
      case FieldType.URLField:
        return <Input type="url" />;
      case FieldType.TagField:
        return <TagField />;
      case FieldType.BooleanField:
      case FieldType.NullBooleanField:
        return <Switch />;
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
      case FieldType.AutoField:
        return null;
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
          <FormItem
            className={cn(
              layout === "horizontal"
                ? "flex items-start space-y-0"
                : "space-y-1",
            )}
          >
            <div
              className={cn({
                "w-[200px] shrink-0": layout === "horizontal",
              })}
            >
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
                  config={contentType.admin?.fieldConfig?.[name]}
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
