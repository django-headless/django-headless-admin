import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import * as dayjs from "dayjs";
import * as R from "ramda";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useContentType from "@/hooks/useContentType";
import useListDisplayFields from "@/hooks/useListDisplayFields";
import useListDisplayLinks from "@/hooks/useListDisplayLinks";
import useTitle from "@/hooks/useTitle";
import { ContentType, ContentTypeField, FieldType } from "@/types";

export function ListPage() {
  const { apiId } = useParams<"apiId">();
  const contentType = useContentType(apiId!);

  return contentType && apiId ? (
    <Main apiId={apiId} contentType={contentType} />
  ) : null;
}

function Main({
  contentType,
  apiId,
}: {
  contentType: ContentType;
  apiId: string;
}) {
  const resourceName =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const fields = useListDisplayFields(contentType);
  const displayLinks = useListDisplayLinks(contentType);
  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      fields.map(([key, field]) => ({
        id: key,
        accessorKey: key,
        header: field.label ?? "",
        cell({ getValue, row, cell }) {
          const isLink =
            displayLinks.includes(key) ||
            (R.isEmpty(displayLinks) && cell.column.getIndex() === 0);

          return isLink ? (
            <Link
              to={`/collections/${apiId}/${row.original.id}`}
              className="text-primary-600 hover:underline font-semibold"
            >
              <FieldDisplay field={field} value={getValue()} />
            </Link>
          ) : (
            <FieldDisplay field={field} value={getValue()} />
          );
        },
      })),
    [fields],
  );

  useTitle(resourceName);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    refineCoreProps: { resource: apiId },
    columns,
  });

  return (
    <div>
      <h1>{resourceName}</h1>

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

      <Paginator
        pages={pageCount}
        current={current}
        onPageChange={setCurrent}
      />
    </div>
  );
}

function Paginator({
  pages,
  current,
  onPageChange,
}: {
  pages: number;
  current: number;
  onPageChange(page: number): void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function FieldDisplay({
  field,
  value,
}: {
  field: ContentTypeField;
  value: any;
}) {
  return field.type === FieldType.DateTimeField ? (
    <div>{dayjs(value).format("L LT")}</div>
  ) : field.type === FieldType.DateField ? (
    <div>{dayjs(value).format("L")}</div>
  ) : field.type === FieldType.MediaField ? (
    <img src={value} alt="" className="size-12 object-cover rounded-md" />
  ) : (
    value
  );
}
