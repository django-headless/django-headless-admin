import * as R from "ramda";
import React, { type FocusEventHandler } from "react";

import { cn } from "@/utils/cn";

const MultipleChoiceField = React.forwardRef<
  React.ElementRef<"div">,
  MultipleChoiceFieldProps
>(({ onChange, onBlur, value = [], options, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 flex-wrap text-sm", className)}
    >
      {options.map(([choice, label]) => (
        <button
          key={choice}
          onBlur={onBlur}
          onClick={(e) => {
            e.preventDefault();
            onChange?.(
              R.ifElse(
                R.includes(choice),
                R.without([choice]),
                R.append(choice),
              )(value ?? []),
            );
          }}
          className={cn(
            "px-2 py-0.5 rounded select-none hover:cursor-pointer",
            value?.includes(choice)
              ? "bg-primary text-primary-foreground shadow"
              : "bg-accent text-accent-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
});

MultipleChoiceField.displayName = "ChoiceField";

interface MultipleChoiceFieldProps {
  options: [string, string][];
  value?: string[] | null;
  onChange?(value: string[]): void;
  onBlur?: FocusEventHandler;
  className?: string;
}

export { MultipleChoiceField };
