import { useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { flexRender } from "@tanstack/react-table";
import * as R from "ramda";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { InlineModal } from "@/components/inline-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useColumns from "@/hooks/useColumns";
import useContentType from "@/hooks/useContentType";
import useTitle from "@/hooks/useTitle";
import { ContentType } from "@/types";
import { cn } from "@/utils/cn";

export function ListPage() {
  const { resourceId } = useParams<"resourceId">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    <Main resourceId={resourceId} contentType={contentType} />
  ) : null;
}

export function Main({
  contentType,
  resourceId,
  title,
}: {
  contentType: ContentType;
  resourceId: string;
  title?: string;
}) {
  const translate = useTranslate();
  const resourceName =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const columns = useColumns(contentType);
  const [search, setSearch] = useState("");

  useTitle(title || resourceName);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      setFilters,
      setCurrent,
      pageCount,
      current,
      tableQuery: { isFetching, isPreviousData, data },
    },
  } = useTable({
    refineCoreProps: {
      resource: resourceId,
      syncWithLocation: true,
      pagination: { pageSize: contentType.admin?.listPerPage },
    },
    columns,
  });

  return (
    <div className="p-16">
      <div className="flex mb-12 justify-between items-center">
        <h1 className="text-3xl font-bold">{title || resourceName}</h1>
        {contentType.admin?.permissions.add && (
          <InlineModal resourceId={resourceId} id={null}>
            <Button>
              {translate("pages.list.add", {
                resourceName: contentType.verboseName,
              })}
            </Button>
          </InlineModal>
        )}
      </div>

      <div className="mb-4 empty:hidden flex items-center gap-1">
        {contentType.admin?.enableSearch && (
          <Input
            placeholder={translate("pages.list.search", {
              resourceName: resourceName.toLocaleLowerCase(),
            })}
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilters([
                  { field: "search", operator: "eq", value: search },
                ]);
              }
            }}
          />
        )}
      </div>

      <div
        className={cn("rounded-md mb-6 bg-white", {
          "animate-pulse": isFetching && isPreviousData,
        })}
      >
        <Table>
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!isFetching && R.isEmpty(data?.data) && (
        <div className="select-none text-center text-sm text-muted-foreground py-12">
          {translate("pages.list.empty_state")}
        </div>
      )}

      <Pagination
        pages={pageCount}
        current={current}
        onPageChange={setCurrent}
      />
    </div>
  );
}
