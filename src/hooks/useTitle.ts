import { useDocumentTitle } from "@mantine/hooks";

import useAdminSite from "@/hooks/useAdminSite";

export default function useTitle(title?: string | null) {
  const { data } = useAdminSite();

  useDocumentTitle(
    `${title ?? data?.data.indexTitle ?? ""} | ${data?.data.siteTitle ?? ""}`,
  );
}
