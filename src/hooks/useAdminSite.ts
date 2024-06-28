import { useCustom } from "@refinedev/core";

import { AdminSite } from "@/types";

export default function useAdminSite() {
  return useCustom<AdminSite>({
    url: "/admin-site",
  });
}
