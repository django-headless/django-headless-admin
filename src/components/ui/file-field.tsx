import * as React from "react";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";

export interface FileFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChange?(f: File | null): void;
  value?: string | null;
  type?: "file" | "image" | "video" | "audio";
}

const FileField = React.forwardRef<HTMLDivElement, FileFieldProps>(
  ({ className, type = "file", value, onChange, ...props }, ref) => {
    const initialValue = useMemo(() => value, [!value]);

    return (
      <div ref={ref} {...props}>
        <div className="mb-2 text-xs text-muted-foreground">{initialValue}</div>
        <Input
          type="file"
          accept={type === "file" ? "*" : `${type}/*`}
          className="hover:cursor-pointer"
          onChange={(e) => {
            onChange?.(e.target.files?.[0] ?? null);
          }}
        />
      </div>
    );
  },
);
FileField.displayName = "FileField";

export { FileField };
