import { useList } from "@refinedev/core";
import * as R from "ramda";
import React from "react";
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
    <div className="space-y-4">
      {contentType.admin.inlines?.map((inline, idx) => (
        <TabularInline key={idx} inline={inline} />
      ))}
    </div>
  );
}

export function TabularInline({ inline }: { inline: Inline }) {
  const contentType = useContentType(inline.apiId);
  const fieldNames = useAdminFields(contentType);
  const { id } = useParams<"id">();
  const { data } = useList({
    resource: inline.apiId,
    filters: [{ operator: "eq", field: inline.fkName, value: id }],
  });
  /**
   * We flatten the field names array as fieldsets are not supported
   * in this view. We also remove the foreign key field as it is implicit.
   */
  const fields = R.pipe(R.flatten, R.without([inline.fkName]))(fieldNames);

  return (
    contentType && (
      <div className="bg-white p-8 border rounded">
        <h4 className="font-semibold text-lg mb-8">
          {contentType.verboseNamePlural}
        </h4>
        <div className="rounded border overflow-hidden">
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
          >
            <PiTrash />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
