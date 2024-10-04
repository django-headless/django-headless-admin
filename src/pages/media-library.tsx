import { useCustom, useDelete, useList, useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { flexRender } from "@tanstack/react-table";
import * as R from "ramda";
import { useState } from "react";
import { PiFolder, PiHouseBold, PiPlus, PiTrash } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();

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
            <InlineModal resourceId={ITEM_RESOURCE_ID} id={null}>
              <Button>
                {translate("pages.list.add", {
                  resourceName: itemCT.verboseName,
                })}
              </Button>
            </InlineModal>
          )}
        </div>
      </div>

      <div className="mb-12">
        <FolderPath />
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
  const [searchParams] = useSearchParams();

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
      resource: ITEM_RESOURCE_ID,
      syncWithLocation: true,
      pagination: { pageSize: contentType.admin?.listPerPage },
      filters: {
        permanent: [
          {
            field: "folder",
            operator: "eq",
            value: searchParams.get("folder"),
          },
        ],
      },
    },
    columns,
  });

  return (
    <div>
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

      <MediaFolders />

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

export function MediaFolders() {
  const translate = useTranslate();
  const contentType = useContentType(FOLDER_RESOURCE_ID);
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: deleteFolder } = useDelete();
  const folder = searchParams.get("folder");
  const { isFetching, isPreviousData, data } = useList({
    resource: FOLDER_RESOURCE_ID,
    filters: [
      {
        field: "parent",
        operator: "eq",
        value: folder,
      },
    ],
  });
  const { data: folderPath } = useCustom({
    url: `/media-library/folder-path?folder=${searchParams.get("folder") ?? ""}`,
    method: "get",
  });

  return (
    <div className="mt-6">
      <div
        className={cn("rounded-md mb-6 border-dashed border", {
          "animate-pulse": isFetching && isPreviousData,
        })}
      >
        <ul className="pt-2 space-y-2">
          {folderPath?.data && !R.isEmpty(folderPath.data) && (
            <li className="px-4">
              <button
                onClick={() =>
                  setSearchParams((searchParams) => {
                    const parent =
                      folderPath.data[folderPath.data.length - 2]?.id ?? null;

                    if (parent) {
                      searchParams.set("folder", parent);
                    } else {
                      searchParams.delete("folder");
                    }
                    return searchParams;
                  })
                }
              >
                {".."}
              </button>
            </li>
          )}
          {data?.data.map((folder) => (
            <li
              key={folder.id}
              className="group font-medium text-sm px-4 flex items-center justify-between gap-2"
            >
              <button
                className="flex items-center gap-2"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("folder", folder.id);
                    return searchParams;
                  })
                }
              >
                <PiFolder className="text-lg" />
                <span>{folder.name}</span>
              </button>
              <button
                className="invisible group-hover:visible text-destructive"
                onClick={() => {
                  if (confirm("Are you sure?")) {
                    deleteFolder({
                      resource: FOLDER_RESOURCE_ID,
                      id: folder.id,
                    });
                  }
                }}
              >
                <PiTrash />
              </button>
            </li>
          ))}
          <li className="font-medium text-sm border-t border-dashed px-4 py-2">
            {contentType.admin?.permissions.add && (
              <InlineModal
                resourceId={FOLDER_RESOURCE_ID}
                id={null}
                prefilledValues={{ parent: searchParams.get("folder") }}
              >
                <button
                  className="flex items-center gap-2 text-muted-foreground hover:text-secondary-foreground"
                  onClick={() => {}}
                >
                  <PiPlus className="mr-1" />
                  <span>{translate("pages.media_library.new_folder")}</span>
                </button>
              </InlineModal>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export function FolderPath() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isFetching, isPreviousData, data } = useCustom({
    url: `/media-library/folder-path?folder=${searchParams.get("folder") ?? ""}`,
    method: "get",
  });

  return (
    <div>
      <div
        className={cn("rounded-md mb-6 bg-white", {
          "animate-pulse": isFetching && isPreviousData,
        })}
      >
        <ul className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <li className="flex">
            <button
              onClick={() =>
                setSearchParams((searchParams) => {
                  searchParams.delete("folder");
                  return searchParams;
                })
              }
            >
              <PiHouseBold />
            </button>
          </li>
          {data?.data.map((folder) => (
            <li key={folder.id} className="flex items-center gap-2">
              <span className="select-none">{"/"}</span>
              <button
                className="hover:underline"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("folder", folder.id);
                    return searchParams;
                  })
                }
              >
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
