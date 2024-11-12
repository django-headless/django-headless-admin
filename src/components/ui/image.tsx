import React from "react";

import useConfig from "@/hooks/useConfig";

export const Image = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & { width: number }
>(({ src, width, ...props }, ref) => {
  const { imageLoader } = useConfig();

  return src ? (
    <img
      ref={ref}
      src={imageLoader ? imageLoader({ src, width }) : src}
      {...props}
    />
  ) : null;
});

Image.displayName = "Image";
