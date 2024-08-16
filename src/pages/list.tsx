import { useTable } from "@refinedev/react-table";
import { flexRender } from "@tanstack/react-table";
import { useParams } from "react-router-dom";

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

export function ListPage() {
  const { resourceId } = useParams<"resourceId">();
  const contentType = useContentType(resourceId!);

  return contentType && resourceId ? (
    <Main resourceId={resourceId} contentType={contentType} />
  ) : null;
}

function Main({
  contentType,
  resourceId,
}: {
  contentType: ContentType;
  resourceId: string;
}) {
  const resourceName =
    contentType.verboseNamePlural || `${contentType.verboseName}s`;
  const columns = useColumns(contentType);

  useTitle(resourceName);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    refineCoreProps: { resource: resourceId },
    columns,
  });

  return (
    <div className="p-16">
      <h1 className="text-3xl font-bold mb-6">{resourceName}</h1>

      <div className="rounded-md border mb-6 bg-white">
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

      <Pagination
        pages={pageCount}
        current={current}
        onPageChange={setCurrent}
      />
    </div>
  );
}
