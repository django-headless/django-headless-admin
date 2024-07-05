import React, { forwardRef } from "react";

export const ModIcon = forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span">
>(function ModIcon(props, ref) {
  const modifierKeyPrefix = modKey();

  return (
    <span {...props} ref={ref}>
      {modifierKeyPrefix}
    </span>
  );
});

export function modKey() {
  return navigator.platform.indexOf("Mac") === 0 ||
    navigator.platform === "iPhone"
    ? "⌘"
    : "^";
}
