import { useCustom } from "@refinedev/core";

import { AdminSite } from "@/types";

export default function useAdminConfig() {
  return useCustom<AdminSite>({
    url: "/admin-site",
  });
}
