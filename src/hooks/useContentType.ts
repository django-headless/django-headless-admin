import useContentTypes from "@/hooks/useContentTypes";

export default function useContentType(apiId: string) {
  const { data } = useContentTypes();

  return apiId ? data?.data?.[apiId] ?? null : null;
}
