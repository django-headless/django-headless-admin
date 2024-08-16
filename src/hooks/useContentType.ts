import useContentTypes from "@/hooks/useContentTypes";

export default function useContentType(resourceId: string) {
  const { data } = useContentTypes();

  return resourceId ? (data?.data?.[resourceId] ?? null) : null;
}
