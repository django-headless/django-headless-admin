import { useDelete, useList, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import { PiTrash } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";

import { ContentFieldDisplay } from "@/components/content-field-display";
import { InlineModal } from "@/components/inline-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
  const translate = useTranslate();
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
      <div className="p-4 border rounded">
        <div className="flex items-center mb-4 justify-between">
          <h4 className="font-semibold text-lg">
            {contentType.verboseNamePlural}
          </h4>
          <div>
            <InlineModal
              resourceId={inline.resourceId}
              id={null}
              prefilledValues={{ [inline.fkName]: id }}
            >
              <Button variant="outline" size="sm">
                {translate("components.inlines.create", {
                  resourceName: contentType.verboseName,
                })}
              </Button>
            </InlineModal>
          </div>
        </div>
        {!data?.data ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : R.isEmpty(data.data) ? (
          <div className="text-center text-sm text-muted-foreground select-none py-12">
            {translate("components.inlines.empty_state", {
              resourceName: contentType.verboseNamePlural,
            })}
          </div>
        ) : (
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
              {data.data.map((record) => (
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
        )}
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
      {R.isEmpty(fields) && (
        <TableCell>
          <Link
            to={`/content/${contentType.resourceId}/${record.id}`}
            className="font-medium hover:underline"
          >
            {record.__str__}
          </Link>
        </TableCell>
      )}
      {fields.map((name) => (
        <TableCell key={name}>
          <ContentFieldDisplay
            config={contentType.admin?.fieldConfig?.[name]}
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
