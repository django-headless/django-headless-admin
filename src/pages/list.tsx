import { Pagination, Table, Title } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import * as R from "ramda";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import useContentTypes from "@/hooks/useContentTypes";
import useTitle from "@/hooks/useTitle";

export function ListPage() {
  const { apiId } = useParams();
  const { data } = useContentTypes();
  const contentType = apiId ? data?.data?.[apiId] : null;
  const resourceName = contentType?.verboseNamePlural || "";
  const fields = useMemo(
    () =>
      R.pipe(
        Object.entries,
        R.filter(([key, _]) => contentType?.admin.listDisplay.includes(key)),
      )(contentType?.fields ?? {}),
    [contentType],
  );
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
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <Pagination
        position="right"
        total={pageCount}
        page={current}
        onChange={setCurrent}
      />
    </List>
  );
}
