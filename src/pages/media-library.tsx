import { useDeleteMany, useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { flexRender, type RowSelectionState } from "@tanstack/react-table";
import * as R from "ramda";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { InlineModal } from "@/components/inline-modal";
import { FolderPath, MediaFolders } from "@/components/media-library";
import { MediaLibraryModal } from "@/components/media-library-modal";
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
import { Sort } from "@/pages/list";
import { cn } from "@/utils/cn";

const ITEM_RESOURCE_ID = "media-library/items";
const FOLDER_RESOURCE_ID = "media-library/folders";

export function MediaLibrary() {
  const contentType = useContentType(ITEM_RESOURCE_ID);

  return contentType ? <Main /> : null;
}

export function Main() {
  const translate = useTranslate();
  const itemCT = useContentType(ITEM_RESOURCE_ID);
  const folderCT = useContentType(FOLDER_RESOURCE_ID);
  const [searchParams, setSearchParams] = useSearchParams();

  useTitle(translate("pages.media_library.title"));

  return (
    <div className="p-16">
      <div className="flex mb-4 justify-between items-center">
        <h1 className="text-3xl font-bold">
          {translate("pages.media_library.title")}
        </h1>
        <div className="flex items-center gap-3">
          {folderCT.admin?.permissions.add && (
            <InlineModal
              resourceId={FOLDER_RESOURCE_ID}
              id={null}
              prefilledValues={{ parent: searchParams.get("folder") }}
            >
              <Button variant="outline">
                {translate("pages.list.add", {
                  resourceName: folderCT.verboseName,
                })}
              </Button>
            </InlineModal>
          )}
          {itemCT.admin?.permissions.add && (
            <MediaLibraryModal folder={searchParams.get("folder")}>
              <Button>
                {translate("pages.list.add", {
                  resourceName: itemCT.verboseName,
                })}
              </Button>
            </MediaLibraryModal>
          )}
        </div>
      </div>

      <div className="mb-12">
        <FolderPath
          folder={searchParams.get("folder")}
          onSelect={(folder) =>
            setSearchParams((searchParams) => {
              if (folder) {
                searchParams.set("folder", folder);
              } else {
                searchParams.delete("folder");
              }
              return searchParams;
            })
          }
        />
      </div>

      <MediaItems />
    </div>
  );
}

export function MediaItems() {
  const translate = useTranslate();
  const contentType = useContentType(ITEM_RESOURCE_ID);
  const resourceName =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const columns = useColumns(contentType);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const folder = searchParams.get("folder");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { mutateAsync, isLoading } = useDeleteMany();

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      setFilters,
      setSorters,
      setCurrent,
      sorters,
      pageCount,
      current,
      tableQuery: { isFetching, isPreviousData, data },
    },
  } = useTable({
    refineCoreProps: {
      resource: ITEM_RESOURCE_ID,
      syncWithLocation: true,
      pagination: { pageSize: contentType.admin?.listPerPage },
      filters: {
        permanent: [
          {
            field: "folder",
            operator: "eq",
            value: R.isNil(folder) ? "<NULL>" : folder,
          },
        ],
      },
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    columns,
    getRowId: R.prop<string>("id"),
    state: {
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-4 empty:hidden flex items-center gap-1">
        <div className="flex-1">
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
                    resource: ITEM_RESOURCE_ID,
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

      <MediaFolders
        folder={searchParams.get("folder")}
        onSelect={(folder) =>
          setSearchParams((searchParams) => {
            // Reset the current page number
            setCurrent(1);
            if (folder) {
              searchParams.set("folder", folder);
            } else {
              searchParams.delete("folder");
            }
            return searchParams;
          })
        }
      />

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
