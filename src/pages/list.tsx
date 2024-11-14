import { type CrudSort, useDeleteMany, useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { flexRender, type RowSelectionState } from "@tanstack/react-table";
import * as R from "ramda";
import React, { useEffect, useState } from "react";
import { PiSortAscendingBold } from "react-icons/pi";
import { useParams } from "react-router-dom";

import { InlineModal } from "@/components/inline-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { mutateAsync, isLoading } = useDeleteMany();

  useTitle(title || resourceName);

  React.useEffect(() => {
    setFilters([], "replace");
    setSorters([]);
    setRowSelection({});
  }, [resourceId]);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      sorters,
      setSorters,
      setFilters,
      setCurrent,
      filters,
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
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: R.prop<string>("id"),
    columns,
    state: {
      rowSelection,
    },
  });

  const [search, setSearch] = useState(
    filters.find(R.whereEq({ field: "search" }))?.value ?? "",
  );

  useEffect(() => {
    setRowSelection({});
  }, [filters, current, sorters]);

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

        <div className="flex items-center gap-1">
          {!R.isEmpty(rowSelection) && (
            <Button
              variant="destructive"
              size="sm"
              loading={isLoading}
              onClick={async () => {
                if (window.confirm("Are you sure?")) {
                  await mutateAsync({
                    resource: resourceId,
                    ids: Object.keys(R.pickBy(R.identity, rowSelection)),
                  });
                  setRowSelection({});
                }
              }}
            >
              {translate("pages.list.bulk_delete", {
                count: Object.keys(rowSelection).length,
              })}
            </Button>
          )}
          <Sort
            contentType={contentType}
            value={sorters[0] ?? null}
            onChange={(sort) => {
              setSorters([sort]);
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

      <div className="flex items-center gap-3 justify-between">
        {!R.isEmpty(rowSelection) && (
          <div className="text-sm text-muted-foreground shrink-0 select-none">
            {translate("pages.list.rows_selected", {
              count: Object.keys(rowSelection).length,
            })}
          </div>
        )}
        <Pagination
          pages={pageCount}
          current={current}
          onPageChange={setCurrent}
        />
      </div>
    </div>
  );
}

export function Sort({
  contentType,
  value,
  onChange,
}: {
  contentType: ContentType;
  value: CrudSort | null;
  onChange(value: CrudSort | null): void;
}) {
  const translate = useTranslate();
  const fields = contentType.admin.sortableBy ?? contentType.admin.listDisplay;

  return !R.isEmpty(fields) ? (
    <Select
      value={value?.field ?? ""}
      onValueChange={(field) =>
        onChange?.(value ? { ...value, field } : { field, order: "asc" })
      }
    >
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
        <SelectSeparator />
        <div className="p-2">
          <Label className="font-medium flex items-center gap-2">
            <Switch
              disabled={!value}
              value={value?.order === "asc"}
              onChange={(checked) =>
                onChange?.({ ...value, order: checked ? "asc" : "desc" })
              }
            />
            {translate("pages.list.asc")}
          </Label>
        </div>
      </SelectContent>
    </Select>
  ) : null;
}
