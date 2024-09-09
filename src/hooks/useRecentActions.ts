import { useCustom } from "@refinedev/core";

import { type RecentAction } from "@/types";

export default function useRecentActions() {
  return useCustom<RecentAction[]>({
    url: "/recent-actions",
  });
}
