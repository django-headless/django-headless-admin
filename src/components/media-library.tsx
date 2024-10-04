import { useCustom, useDelete, useList, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import { PiFolder, PiHouseBold, PiPlus, PiTrash } from "react-icons/pi";

import { InlineModal } from "@/components/inline-modal";
import useContentType from "@/hooks/useContentType";
import { cn } from "@/utils/cn";

const FOLDER_RESOURCE_ID = "media-library/folders";

export function MediaFolders({
  folder,
  onSelect,
}: {
  folder: string | null;
  onSelect?(folder: string | null): void;
}) {
  const translate = useTranslate();
  const contentType = useContentType(FOLDER_RESOURCE_ID);
  const { mutate: deleteFolder } = useDelete();
  const { isFetching, isPreviousData, data } = useList({
    resource: FOLDER_RESOURCE_ID,
    filters: [
      {
        field: "parent",
        operator: "eq",
        value: R.isNil(folder) ? "<NULL>" : folder,
      },
    ],
  });
  const { data: folderPath } = useCustom({
    url: `/media-library/folder-path?folder=${folder ?? ""}`,
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
                onClick={(e) => {
                  const parent =
                    folderPath.data[folderPath.data.length - 2]?.id ?? null;
                  onSelect?.(parent);
                }}
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
                onClick={() => onSelect?.(folder.id)}
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
                prefilledValues={{ parent: folder }}
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

export function FolderPath({
  folder,
  onSelect,
}: {
  folder: string | null;
  onSelect?(folder: string | null): void;
}) {
  const { isFetching, isPreviousData, data } = useCustom({
    url: `/media-library/folder-path?folder=${folder ?? ""}`,
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
            <button onClick={() => onSelect?.(null)}>
              <PiHouseBold />
            </button>
          </li>
          {data?.data.map((folder) => (
            <li key={folder.id} className="flex items-center gap-2">
              <span className="select-none">{"/"}</span>
              <button
                className="hover:underline"
                onClick={() => onSelect?.(folder.id)}
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
