import { useContext } from "react";

import { ConfigContext } from "@/providers/config-provider";

export default function useConfig() {
  return useContext(ConfigContext);
}
