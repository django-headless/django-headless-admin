import React from "react";

import type { HeadlessConfig } from "@/types";

export const ConfigContext = React.createContext<Partial<HeadlessConfig>>({});

export function ConfigProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Partial<HeadlessConfig>;
}) {
  console.log(config);
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
