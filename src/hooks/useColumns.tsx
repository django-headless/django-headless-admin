import { useTranslate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import * as R from "ramda";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { ContentFieldDisplay } from "@/components/content-field-display";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useListDisplayFields from "@/hooks/useListDisplayFields";
import useListDisplayLinks from "@/hooks/useListDisplayLinks";
import { ContentType } from "@/types";

export default function useColumns(contentType: ContentType) {
  const fields = useListDisplayFields(contentType);
  const displayLinks = useListDisplayLinks(contentType);
  const translate = useTranslate();

  return useMemo<ColumnDef<any>[]>(
    () =>
      R.pipe(
        R.map(([key, contentTypeField]) => ({
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
                  canLink={false}
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
        R.prepend({
          id: "select",
          header({ table }) {
            return (
              <Tooltip>
                <TooltipContent>
                  {translate("pages.list.select_page")}
                </TooltipContent>
                <TooltipTrigger asChild>
                  <div>
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(checked) =>
                        table.toggleAllPageRowsSelected(checked)
                      }
                    />
                  </div>
                </TooltipTrigger>
              </Tooltip>
            );
          },
          cell({ row }) {
            return (
              <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(checked) => row.toggleSelected(checked)}
              />
            );
          },
        }),
      )(fields),
    [fields, contentType.resourceId, displayLinks],
  );
}
