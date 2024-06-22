import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@mantine/core";
import { cva } from "class-variance-authority";

import cn from "@/utils/cn.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm",
  {
    variants: {
      variant: {
        default: "border bg-white hover:border-gray-300 shadow-sm",
      },
      size: {
        default: "h-9 px-6",
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <BaseButton
      classNames={{
        root: cn(buttonVariants({ variant, size, className })),
      }}
      {...props}
    />
  );
}

export interface ButtonProps
  extends Omit<BaseButtonProps, "variant" | "size" | "classNames"> {}
