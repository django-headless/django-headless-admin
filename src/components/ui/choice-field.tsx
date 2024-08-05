import React, { type FocusEventHandler } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChoiceField = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  ChoiceFieldProps
>(({ onChange, onBlur, value, options }, ref) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger ref={ref} onBlur={onBlur}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

ChoiceField.displayName = "ChoiceField";

interface ChoiceFieldProps {
  value?: string;
  onChange?(value: string): void;
  onBlur?: FocusEventHandler;
  options: [string, string][];
}

export { ChoiceField };
