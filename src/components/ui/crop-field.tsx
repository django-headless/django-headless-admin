"use client";
import "react-image-crop/dist/ReactCrop.css";

import * as R from "ramda";
import React from "react";
import ReactCrop from "react-image-crop";

import { Image } from "@/components/ui/image";
import type { CropValue } from "@/types";

const CropField = ({
  value,
  onChange,
  media,
}: {
  value?: CropValue[];
  onChange?(crop: CropValue[]): void;
  media: any;
}) => {
  const src = media.file;

  return (
    <ReactCrop
      ruleOfThirds
      crop={value[0]}
      className="w-full"
      onChange={(_, p) =>
        onChange([
          R.evolve({
            x: (n) => n.toFixed(2),
            y: (n) => n.toFixed(2),
            width: (n) => n.toFixed(2),
            height: (n) => n.toFixed(2),
          })(p),
        ])
      }
    >
      <Image alt="" src={src} width={960} className="w-full rounded" />
    </ReactCrop>
  );
};

export { CropField };
