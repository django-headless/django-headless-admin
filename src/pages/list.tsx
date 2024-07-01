import { Pagination, Table, Title } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import useContentType from "@/hooks/useContentType.ts";
import useListDisplayFields from "@/hooks/useListDisplayFields.ts";
import useTitle from "@/hooks/useTitle";
import { ContentType } from "@/types.ts";

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
  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      fields.map(([key, field]) => ({
        id: key,
        accessorKey: key,
        header: field.label,
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
