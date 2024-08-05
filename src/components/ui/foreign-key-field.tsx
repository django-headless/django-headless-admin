import { useList, useOne, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes, useState } from "react";

import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/utils/cn";

const ForeignKeyField = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  ForeignKeyFieldProps
>(({ value, className, resourceId, ...props }, ref) => {
  const translate = useTranslate();
  const [search, setSearch] = useState("");
  const { data: list } = useList({
    resource: resourceId,
    filters: [{ field: "search", operator: "contains", value: search }],
  });
  const { data: selected } = useOne({
    resource: resourceId,
    id: value!,
    queryOptions: {
      enabled: !R.isNil(value),
    },
  });
  const options = R.pipe(
    R.defaultTo([]),
    R.unless(() => R.isNil(selected), R.prepend(selected?.data)),
    R.uniqBy<any, any>(R.prop("id")),
  )(list?.data);

  return (
    <Combobox
      ref={ref}
      value={value}
      className={cn("flex", className)}
      {...props}
      onSearchValueChange={setSearch}
      placeholder={translate("components.combobox.placeholder")}
      options={options.map(({ id, __str__ }) => ({
        value: id,
        label: __str__,
      }))}
    />
  );
});

ForeignKeyField.displayName = "ForeignKeyField";

interface ForeignKeyFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | null;
  onChange?(value: string): void;
  resourceId: string;
}

export { ForeignKeyField };
