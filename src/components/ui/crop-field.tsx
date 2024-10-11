"use client";
import "react-image-crop/dist/ReactCrop.css";

import { useOne } from "@refinedev/core";
import * as R from "ramda";
import React, { useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";

const ITEM_RESOURCE_ID = "media-library/items";

const CropField = ({
  value,
  onChange,
  media,
  aspect,
  disabled,
}: {
  value?: any;
  onChange?(crop: any): void;
  media: string;
  aspect: string | number;
  disabled?: boolean;
}) => {
  const { data } = useOne({
    resource: ITEM_RESOURCE_ID,
    id: media,
    queryOptions: {
      enabled: !R.isNil(media),
    },
  });
  const src = data?.data.file;

  // Reset crop whenever the aspect ratio changes.
  useEffect(() => {
    onChange(null);
  }, [aspect]);

  return (
    <ReactCrop
      disabled={disabled}
      ruleOfThirds
      aspect={aspect ? Number(aspect) : undefined}
      crop={value}
      onChange={(_, p) =>
        onChange(
          R.evolve({
            x: (n) => n.toFixed(2),
            y: (n) => n.toFixed(2),
            width: (n) => n.toFixed(2),
            height: (n) => n.toFixed(2),
          })(p),
        )
      }
    >
      <img alt="" src={src} className="h-[480px] w-auto rounded" />
    </ReactCrop>
  );
};

export { CropField };
