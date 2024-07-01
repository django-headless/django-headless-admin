import { Pagination, Table, Title } from "@mantine/core";
import { DateField, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import * as R from "ramda";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

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
        cell: function render({ getValue, row, cell }) {
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
    <List title={<Title>{resourceName}</Title>}>
      <Table>
        <Table.Thead>
          {getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <br />
      <Pagination total={pageCount} value={current} onChange={setCurrent} />
    </List>
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
    <DateField value={value} format="L LT" />
  ) : field.type === FieldType.DateField ? (
    <DateField value={value} format="L" />
  ) : field.type === FieldType.MediaField ? (
    <img src={value} alt="" className="size-12 object-cover rounded-md" />
  ) : (
    value
  );
}
