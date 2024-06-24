import { useDocumentTitle } from "@mantine/hooks";

import useAdminConfig from "@/hooks/useAdminConfig";

export default function useTitle(title?: string | null) {
  const { data } = useAdminConfig();

  useDocumentTitle(
    `${title ?? data?.data.indexTitle ?? ""} | ${data?.data.siteTitle ?? ""}`,
  );
}
