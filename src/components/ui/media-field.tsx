import { useList, useOne, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes, useState } from "react";
import { PiCheckBold, PiXBold } from "react-icons/pi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";

const MediaField = React.forwardRef<React.ElementRef<"div">, MediaFieldProps>(
  (
    {
      value,
      className,
      onChange,
      multiple = false,
      clearable = false,
      ...props
    },
    ref,
  ) => {
    const translate = useTranslate();
    const { data } = useOne({
      resource: "media_library",
      id: value,
      queryOptions: {
        enabled: !R.isNil(value),
      },
    });

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div className="relative flex items-center shrink-0 group">
          <Avatar className="size-24 rounded-md shadow-sm">
            <AvatarImage src={data?.data.file ?? undefined} alt="" />
            <AvatarFallback className="rounded-md" />
          </Avatar>
          {clearable && !R.isNil(value) && (
            <button
              className="absolute bg-white/50 rounded p-3 left-1/2 -translate-x-1/2 invisible group-hover:visible"
              onClick={(e) => {
                e.preventDefault();
                onChange?.(null);
              }}
            >
              <PiXBold />
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <SelectDialog multiple={multiple} onSelect={(v) => onChange?.(v)}>
              <Button variant="outline">
                {translate("components.media_field.select_media")}
              </Button>
            </SelectDialog>
          </div>
        </div>
      </div>
    );
  },
);

MediaField.displayName = "MediaField";

interface MediaFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;

  onChange?(value: string | null | string[]): void;

  clearable?: boolean;
  multiple?: boolean;
}

export function SelectDialog({
  children,
  multiple,
  onSelect,
}: {
  children: React.ReactElement;
  multiple: boolean;
  onSelect(v: string | string[]): void;
}) {
  const translate = useTranslate();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {translate("components.media_field.dialog_title")}
        </DialogHeader>
        <SelectDialogContent multiple={multiple} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
}

function SelectDialogContent({
  multiple,
  onSelect,
}: {
  multiple: boolean;
  onSelect(v: string | string[]): void;
}): JSX.Element {
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const translate = useTranslate();
  const { data: list } = useList({
    resource: "media_library",
    pagination: { pageSize: 24 },
    filters: [{ field: "search", operator: "contains", value: search }],
  });

  return (
    <div>
      <div className="mb-6">
        <DebouncedInput value={search} onChange={(v) => setSearch(v)} />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {list?.data.map((item: any) => {
          const isSelected = selection.includes(item.id);
          return (
            <button
              key={item.id}
              className="relative"
              onClick={() => {
                if (multiple) {
                  !isSelected
                    ? setSelection(R.append(item.id))
                    : setSelection(R.without([item.id]));
                } else {
                  setSelection([item.id]);
                }
              }}
            >
              <img
                src={item.file}
                alt=""
                className={cn("object-cover aspect-square rounded", {
                  "opacity-40": isSelected,
                })}
              />
              {isSelected && (
                <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow">
                  <PiCheckBold className="size-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-2 pt-6">
        <DialogClose asChild>
          <Button variant="ghost">{translate("common.cancel")}</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={() => onSelect(multiple ? selection : selection[0])}>
            {translate("components.media_field.select_media")}
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}

export { MediaField };
