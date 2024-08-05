"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { PiCheck } from "react-icons/pi";
import { RxCaretSort } from "react-icons/rx";

import { cn } from "@/utils/cn";

import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const Combobox = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  ComboboxProps
>(
  (
    {
      options,
      value,
      onChange,
      renderOption,
      placeholder,
      emptySearch,
      noResults,
      keepOpen,
      disabled = false,
      className,
      onSearchValueChange,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const selectedOption = options.find((option) => option.value === value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "justify-between font-normal",
              { "text-muted-foreground": !value },
              className,
            )}
          >
            {selectedOption
              ? (renderOption?.(selectedOption) ?? selectedOption.label)
              : placeholder}
            <RxCaretSort className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={ref} className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={emptySearch ?? t("common.search")}
              onValueChange={onSearchValueChange}
            />
            <CommandEmpty>
              {noResults ?? t("components.combobox.empty")}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? "" : currentValue);
                    !keepOpen && setOpen(false);
                  }}
                >
                  <PiCheck
                    className={cn(
                      "mr-2 size-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {renderOption?.(option) ?? option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = "Combobox";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string | null;
  onChange?(value: string): void;
  renderOption?(option: { label: string; value: string }): React.ReactNode;
  keepOpen?: boolean;
  placeholder?: string;
  emptySearch?: string;
  noResults?: string;
  disabled?: boolean;
  className?: string;
  onSearchValueChange?(value: string): void;
}

export { Combobox, type ComboboxProps };
