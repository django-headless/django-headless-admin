import React, { forwardRef, useState } from "react";
import { useDebounce } from "react-use";

import { Input } from "@/components/ui/input";

const DebouncedInput = forwardRef<
  React.ComponentRef<typeof Input>,
  Omit<React.ComponentPropsWithoutRef<typeof Input>, "onChange"> & {
    onChange?(v: string): void;
  }
>(({ onChange, value, ...props }, ref) => {
  const [_value, setValue] = useState(String(value));

  useDebounce(
    () => {
      onChange?.(_value ?? "");
    },
    500,
    [_value],
  );

  return (
    <Input
      ref={ref}
      value={_value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});
DebouncedInput.displayName = "DebouncedInput";

export { DebouncedInput };
