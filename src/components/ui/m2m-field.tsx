import { useList, useMany, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes, useState } from "react";
import { PiXBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/utils/cn";

const ManyToManyField = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  ManyToManyFieldProps
>(({ value = [], onChange, className, resourceId, ...props }, ref) => {
  const translate = useTranslate();
  const [search, setSearch] = useState("");
  const { data: list } = useList({
    resource: resourceId,
    filters: [
      { field: "search", operator: "contains", value: search },
      { field: "~id__in", operator: "nin", value: value },
    ],
  });
  const { data: selected } = useMany({
    resource: resourceId,
    ids: value ?? [],
    queryOptions: {
      enabled: !R.isNil(value) && !R.isEmpty(value),
    },
  });

  return (
    <div className="space-y-2 border rounded-md p-4">
      <div className="flex items-center flex-wrap gap-2">
        {value?.map((id) => {
          const record = selected?.data.find(R.whereEq({ id }));

          return (
            record && (
              <div
                key={record.id}
                className="rounded bg-muted pl-2 py-0.5 flex items-center"
              >
                <span className="text-secondary-foreground text-sm font-medium">
                  {record.__str__}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onChange?.(R.without([record.id], value ?? []))
                  }
                >
                  <PiXBold />
                </Button>
              </div>
            )
          );
        })}
      </div>
      <Combobox
        ref={ref}
        className={cn("flex w-full", className)}
        {...props}
        onSearchValueChange={setSearch}
        placeholder={translate("components.m2m_field.placeholder")}
        onChange={(v) => onChange?.(R.append(v, value ?? []))}
        options={
          list?.data.map(({ id, __str__ }) => ({
            value: id,
            label: __str__,
          })) ?? ([] as any)
        }
      />
    </div>
  );
});

ManyToManyField.displayName = "ManyToManyField";

interface ManyToManyFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[] | null;
  onChange?(value: string[]): void;
  resourceId: string;
}

export { ManyToManyField };
