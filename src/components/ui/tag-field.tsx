import { useTranslate } from "@refinedev/core";
import * as R from "ramda";
import * as React from "react";
import { useState } from "react";
import { PiXBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export interface TagFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  onChange?(tags: string[]): void;
}

const TagField = React.forwardRef<HTMLInputElement, TagFieldProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const translate = useTranslate();
    const [text, setText] = useState("");

    return (
      <div className={cn(className)} ref={ref} {...props}>
        <div className="flex flex-wrap items-start gap-2 mb-2">
          {value?.map((tag) => (
            <div
              key={tag}
              className="rounded bg-muted pl-2 py-0.5 flex items-center"
            >
              <span className="text-secondary-foreground text-sm font-medium">
                {tag}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onChange?.(R.without([tag], value))}
              >
                <PiXBold />
              </Button>
            </div>
          ))}
        </div>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={translate("components.tag_field.placeholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange?.(R.uniq([...(value ?? []), text]));
              setText("");
            }
          }}
        />
        {!R.isEmpty(text) && (
          <div className="mt-1 text-xs text-muted-foreground">
            {translate("components.tag_field.hint")}
          </div>
        )}
      </div>
    );
  },
);
TagField.displayName = "TagField";

export { TagField };
