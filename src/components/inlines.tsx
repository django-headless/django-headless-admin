import { useDelete, useList } from "@refinedev/core";
import * as R from "ramda";
import { PiTrash } from "react-icons/pi";
import { useParams } from "react-router-dom";

import { ContentFieldDisplay } from "@/components/content-field-display";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminFields } from "@/hooks/useAdminFields";
import useContentType from "@/hooks/useContentType";
import { ContentType, Inline } from "@/types";

/**
 * Renders the inlines of an admin model.
 */
export function Inlines({ contentType }: { contentType: ContentType }) {
  return (
    <div className="space-y-12 max-w-screen-lg w-full mx-auto lg:w-2/3 z-10 relative my-24">
      {contentType.admin?.inlines?.map((inline, idx) => (
        <TabularInline key={idx} inline={inline} />
      ))}
    </div>
  );
}

export function TabularInline({ inline }: { inline: Inline }) {
  const contentType = useContentType(inline.resourceId);
  const fieldNames = useAdminFields(contentType);
  const { id } = useParams<"id">();
  const { data } = useList({
    resource: inline.resourceId,
    filters: [{ operator: "eq", field: inline.fkName, value: id }],
  });
  /**
   * We flatten the field names array as fieldsets are not supported
   * in this view. We also remove the foreign key field as it is implicit.
   */
  const fields = R.pipe(R.flatten, R.without([inline.fkName]))(fieldNames);

  return (
    contentType && (
      <div className="p-4 border shadow-sm rounded">
        <h4 className="font-semibold text-lg mb-4">
          {contentType.verboseNamePlural}
        </h4>
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((name) => (
                <TableHead key={name}>
                  {contentType.fields[name].label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((record) => (
              <TabularInlineRow
                key={record.id}
                record={record}
                fields={fields}
                contentType={contentType}
                canDelete={inline.canDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  );
}

const TabularInlineRow = ({
  fields,
  contentType,
  record,
  canDelete,
}: {
  fields: string[];
  contentType: ContentType;
  record: Record<string, any>;
  canDelete: boolean;
}) => {
  const { mutate: remove } = useDelete();

  return (
    <TableRow>
      {fields.map((name) => (
        <TableCell key={name}>
          <ContentFieldDisplay
            value={record[name]}
            contentTypeField={contentType.fields[name]}
          />
        </TableCell>
      ))}
      {canDelete && (
        <TableCell align="right">
          <Button
            variant="destructive"
            size="icon"
            className="group-hover/row:visible invisible"
            onClick={() =>
              remove({
                resource: contentType.resourceId,
                id: record.id,
              })
            }
          >
            <PiTrash />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
