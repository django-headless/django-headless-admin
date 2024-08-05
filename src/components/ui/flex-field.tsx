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
                <Label className="font-normal">{property.verboseName}</Label>
              )}
              <Input
                value={R.prop(name, value) || ""}
                onBlur={onBlur}
                onChange={(e) => {
                  onChange(R.assoc(name, e.target.value));
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
  value: Record<string, any>;
  schema: JSONSchema;
  onChange(value: Record<string, any>): void;
}

export { FlexField };
