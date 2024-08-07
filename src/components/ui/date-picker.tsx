"use client";

import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import * as React from "react";
import { PiCalendarDots } from "react-icons/pi";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type DateString } from "@/types";
import { cn } from "@/utils/cn";

const DatePicker = React.forwardRef<
  React.ElementRef<typeof Button>,
  DatePickerProps
>(({ value, onChange, className, ...props }, ref) => {
  const translate = useTranslate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={"outline"}
          {...props}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <PiCalendarDots className="mr-2 size-4" />
          {value ? (
            dayjs(value).format("L")
          ) : (
            <span>{translate("components.date_picker.placeholder")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => onChange?.(dayjs(d).format("YYYY-MM-DD"))}
        />
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = "DatePicker";

export { DatePicker };

interface DatePickerProps extends ButtonProps {
  value?: DateString | null;
  onChange?(value: DateString | null): void;
}
