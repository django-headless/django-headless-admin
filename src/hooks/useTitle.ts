import { useTitle as useBaseTitle } from "react-use";

import useAdminSite from "@/hooks/useAdminSite";

export default function useTitle(title?: string | null) {
  const { data } = useAdminSite();

  useBaseTitle(
    `${title ?? data?.data.indexTitle ?? ""} | ${data?.data.siteTitle ?? ""}`,
  );
}
