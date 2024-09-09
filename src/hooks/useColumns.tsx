import { ColumnDef } from "@tanstack/react-table";
import * as R from "ramda";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { ContentFieldDisplay } from "@/components/content-field-display";
import useListDisplayFields from "@/hooks/useListDisplayFields";
import useListDisplayLinks from "@/hooks/useListDisplayLinks";
import { ContentType } from "@/types";

export default function useColumns(contentType: ContentType) {
  const fields = useListDisplayFields(contentType);
  const displayLinks = useListDisplayLinks(contentType);

  return useMemo<ColumnDef<any>[]>(
    () =>
      fields.map(([key, contentTypeField]) => ({
        id: key,
        accessorKey: key,
        header: contentTypeField.label ?? "",
        cell({ getValue, row, cell }) {
          const value = getValue();
          const isLink =
            displayLinks.includes(key) ||
            (R.isEmpty(displayLinks) && cell.column.getIndex() === 0);

          return isLink ? (
            <Link
              to={`/content/${contentType.resourceId}/${row.original.id}`}
              className="text-primary hover:underline font-semibold"
            >
              <ContentFieldDisplay
                contentTypeField={contentTypeField}
                config={contentType.admin?.fieldConfig?.[key]}
                value={value}
              />
            </Link>
          ) : (
            <ContentFieldDisplay
              contentTypeField={contentTypeField}
              config={contentType.admin?.fieldConfig?.[key]}
              value={value}
            />
          );
        },
      })),
    [fields, contentType.resourceId, displayLinks],
  );
}
