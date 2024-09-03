import * as R from "ramda";
import React, { type HTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type JSONSchema, JSONSchemaType } from "@/types";
import { cn } from "@/utils/cn";

const FlexField = React.forwardRef<React.ElementRef<"div">, FlexFieldProps>(
  ({ onChange, onBlur, value, schema, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex items-start gap-2", className)}
      >
        {Object.entries(schema.properties).map(([name, property]) => {
          return (
            <div key={name}>
              {property.verboseName && (
                <Label className="font-normal text-secondary-foreground">
                  {property.verboseName}
                </Label>
              )}
              <Input
                value={value?.[name] || ""}
                onBlur={onBlur}
                onChange={(e) => {
                  const types = Array.isArray(property.type)
                    ? property.type
                    : [property.type];

                  const fieldValue = R.pipe(
                    R.when(
                      (v) =>
                        !types.includes(JSONSchemaType.String) &&
                        v === "" &&
                        types.includes(JSONSchemaType.Null),
                      R.always(null),
                    ),
                    R.when(
                      (v) =>
                        (types.includes(JSONSchemaType.Integer) ||
                          types.includes(JSONSchemaType.Number)) &&
                        !R.isNil(v),
                      Number,
                    ),
                  )(e.target.value);
                  onChange?.(R.assoc(name, fieldValue, value));
                }}
                type={
                  property.type === JSONSchemaType.Integer ? "number" : "text"
                }
              />
            </div>
          );
        })}
      </div>
    );
  },
);

FlexField.displayName = "FlexField";

interface FlexFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Record<string, any>;
  schema: JSONSchema;
  onChange?(value: Record<string, any>): void;
}

export { FlexField };
