import * as React from "react";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";

export interface FileFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileField = React.forwardRef<HTMLInputElement, FileFieldProps>(
  ({ className, type, value, ...props }, ref) => {
    const initialValue = useMemo(() => value, []);

    return (
      <div ref={ref} {...props}>
        <div className="mb-2 text-xs text-muted-foreground">{initialValue}</div>
        <Input type="file" className="hover:cursor-pointer" />
      </div>
    );
  },
);
FileField.displayName = "FileField";

export { FileField };
