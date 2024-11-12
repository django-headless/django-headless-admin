import { useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { flexRender } from "@tanstack/react-table";
import * as R from "ramda";
import React, { useState } from "react";
import { PiSortAscendingBold } from "react-icons/pi";
import { useParams } from "react-router-dom";

import { InlineModal } from "@/components/inline-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
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

  React.useEffect(() => {
    setFilters([], "replace");
    setSorters([]);
  }, [resourceId]);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      sorters,
      setSorters,
      setFilters,
      setCurrent,
      pageCount,
      current,
      tableQuery: { isFetching, data },
    },
  } = useTable({
    refineCoreProps: {
      resource: resourceId,
      syncWithLocation: true,
      pagination: { pageSize: contentType.admin?.listPerPage },
      queryOptions: {
        keepPreviousData: false,
      },
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

      <div className="mb-4 flex items-center gap-1">
        <div className="flex flex-1">
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

        <div className="flex">
          <Sort
            contentType={contentType}
            value={sorters[0]?.field ?? null}
            onChange={(field) => {
              setSorters([{ field, order: "asc" }]);
            }}
          />
        </div>
      </div>

      {isFetching ? (
        <div className="justify-center items-center flex py-24">
          <Spinner />
        </div>
      ) : (
        <div className="rounded-md mb-6 bg-white">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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

function Sort({
  contentType,
  value,
  onChange,
}: {
  contentType: ContentType;
  value: string | null;
  onChange(value: string | null): void;
}) {
  const translate = useTranslate();
  const fields = contentType.admin.sortableBy ?? contentType.admin.listDisplay;

  return !R.isEmpty(fields) ? (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTriggerPrimitive asChild>
        <Button variant="ghost">
          <PiSortAscendingBold className="mr-1" />
          <SelectValue placeholder={translate("pages.list.sort")} />
        </Button>
      </SelectTriggerPrimitive>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{translate("pages.list.sort_header")}</SelectLabel>
          {fields
            .filter((field) => field !== "__str__")
            .map((field) => (
              <SelectItem key={field} value={field}>
                {contentType.fields[field]?.label || field}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : null;
}
