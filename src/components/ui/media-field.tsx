import { useList, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes, useState } from "react";
import { PiX } from "react-icons/pi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/utils/cn";

const MediaField = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  MediaFieldProps
>(({ value, className, onChange, clearable = false, ...props }, ref) => {
  const translate = useTranslate();
  const [search, setSearch] = useState("");
  const { data: list } = useList({
    resource: "media",
    filters: [{ field: "search", operator: "contains", value: search }],
  });
  const options = list?.data ?? [];

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-24 rounded-md shadow">
        <AvatarImage src={value ?? undefined} alt="" />
        <AvatarFallback className="rounded-md" />
      </Avatar>
      <Combobox
        ref={ref}
        className={cn("flex", className)}
        {...props}
        onChange={(id) => {
          const item = options.find(R.whereEq({ id }));

          item && onChange?.(item.file);
        }}
        onSearchValueChange={setSearch}
        placeholder={translate("components.media_field.placeholder")}
        options={options.map(({ id, __str__ }) => ({
          value: id as string,
          label: __str__,
        }))}
        renderOption={({ value }) => {
          const item = options.find(R.whereEq({ id: value }));

          return item ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="size-12 rounded">
                <AvatarImage src={item.file} alt="" />
              </Avatar>
              <div className="font-medium truncate flex-1">{item.name}</div>
            </div>
          ) : null;
        }}
      />
      {clearable && !R.isNil(value) && (
        <Button onClick={() => onChange?.(null)} size="icon" variant="outline">
          <PiX />
        </Button>
      )}
    </div>
  );
});

MediaField.displayName = "MediaField";

interface MediaFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | null;
  onChange?(value: string | null): void;
  clearable?: boolean;
}

export { MediaField };
