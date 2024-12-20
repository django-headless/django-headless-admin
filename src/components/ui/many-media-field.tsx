import { useMany, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes } from "react";
import { PiXBold } from "react-icons/pi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { SelectDialog } from "@/components/ui/media-field";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";

const ITEM_RESOURCE_ID = "media-library/items";

const ManyMediaField = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  ManyMediaFieldProps
>(({ value = [], onChange, className, ...props }, ref) => {
  const translate = useTranslate();
  const { data: selected } = useMany({
    resource: ITEM_RESOURCE_ID,
    ids: value ?? [],
    queryOptions: {
      enabled: !R.isNil(value) && !R.isEmpty(value),
    },
  });

  return (
    <div
      ref={ref}
      className={cn("space-y-2 border rounded-md p-4", className)}
      {...props}
    >
      <ScrollArea className="whitespace-nowrap">
        <div className="flex items-center w-max gap-2 pt-2 px-2 pb-4">
          {value?.map((id) => {
            const record = selected?.data.find(R.whereEq({ id }));

            return (
              <div
                key={id}
                className="relative flex items-center shrink-0 group"
              >
                <Avatar className="size-24 rounded-md shadow-sm">
                  <AvatarImage src={record?.file ?? undefined} alt="" />
                  <AvatarFallback className="rounded-md" />
                </Avatar>
                <button
                  className="absolute bg-white/50 rounded p-3 left-1/2 -translate-x-1/2 invisible group-hover:visible"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange?.(R.without([id], value ?? []));
                  }}
                >
                  <PiXBold />
                </button>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <SelectDialog
        multiple
        onSelect={(v) => onChange?.(R.uniq([...(value ?? []), ...v]))}
      >
        <Button variant="outline">
          {translate("components.media_field.select_media")}
        </Button>
      </SelectDialog>
    </div>
  );
});

ManyMediaField.displayName = "ManyMediaField";

interface ManyMediaFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[] | null;
  onChange?(value: string[]): void;
}

export { ManyMediaField };
