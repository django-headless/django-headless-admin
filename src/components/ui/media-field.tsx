import { useCreate, useList, useOne, useTranslate } from "@refinedev/core";
import * as R from "ramda";
import React, { type HTMLAttributes, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PiCheckBold, PiFile, PiXBold } from "react-icons/pi";

import { FolderPath, MediaFolders } from "@/components/media-library";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useContentType from "@/hooks/useContentType";
import { cn } from "@/utils/cn";

const ITEM_RESOURCE_ID = "media-library/items";

const MediaField = React.forwardRef<React.ElementRef<"div">, MediaFieldProps>(
  (
    {
      value,
      className,
      onChange,
      multiple = false,
      clearable = false,
      ...props
    },
    ref,
  ) => {
    const translate = useTranslate();
    const { data } = useOne({
      resource: ITEM_RESOURCE_ID,
      id: value,
      queryOptions: {
        enabled: !R.isNil(value),
      },
    });

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div className="relative flex items-center shrink-0 group">
          <Avatar className="size-24 rounded-md shadow-sm">
            <AvatarImage src={data?.data.file ?? undefined} alt="" />
            <AvatarFallback className="rounded-md" />
          </Avatar>
          {clearable && !R.isNil(value) && (
            <button
              className="absolute bg-white/50 rounded p-3 left-1/2 -translate-x-1/2 invisible group-hover:visible"
              onClick={(e) => {
                e.preventDefault();
                onChange?.(null);
              }}
            >
              <PiXBold />
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <SelectDialog multiple={multiple} onSelect={(v) => onChange?.(v)}>
              <Button variant="outline">
                {translate("components.media_field.select_media")}
              </Button>
            </SelectDialog>
          </div>
        </div>
      </div>
    );
  },
);

MediaField.displayName = "MediaField";

interface MediaFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;

  onChange?(value: string | null | string[]): void;

  clearable?: boolean;
  multiple?: boolean;
}

export function SelectDialog({
  children,
  multiple,
  onSelect,
}: {
  children: React.ReactElement;
  multiple: boolean;
  onSelect(v: string | string[]): void;
}) {
  const translate = useTranslate();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen-lg h-full max-h-[920px] flex flex-col">
        <DialogHeader>
          {translate("components.media_field.dialog_title")}
        </DialogHeader>
        <SelectDialogContent multiple={multiple} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
}

function SelectDialogContent({
  multiple,
  onSelect,
}: {
  multiple: boolean;
  onSelect(v: string | string[]): void;
}): JSX.Element {
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState<string | null>(null);
  const translate = useTranslate();
  const { data: list } = useList({
    resource: ITEM_RESOURCE_ID,
    pagination: { current: page, pageSize: 24 },
    filters: [
      { field: "search", operator: "contains", value: search },
      { field: "folder", operator: "eq", value: folder || "<NULL>" },
    ],
  });

  return (
    <div className="flex flex-col flex-1">
      <FolderPath
        folder={folder}
        onSelect={(folderId) => {
          setPage(1);
          setFolder(folderId);
        }}
      />

      <div className="flex items-stretch gap-6 flex-1">
        <div className="flex-1 shrink-0">
          <div className="mb-6">
            <DebouncedInput
              placeholder={translate("common.search")}
              value={search}
              onChange={(v) => {
                setPage(1);
                setSearch(v);
              }}
            />
            <MediaFolders
              folder={folder}
              onSelect={(folderId) => {
                setPage(1);
                setFolder(folderId);
              }}
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {list?.data.map((item: any) => {
              const isSelected = selection.includes(item.id);
              return (
                <Tooltip key={item.id}>
                  <TooltipContent>{item.name}</TooltipContent>
                  <TooltipTrigger asChild>
                    <button
                      className="relative"
                      onClick={() => {
                        if (multiple) {
                          !isSelected
                            ? setSelection(R.append(item.id))
                            : setSelection(R.without([item.id]));
                        } else {
                          setSelection([item.id]);
                        }
                      }}
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.file}
                          alt=""
                          width={200}
                          className={cn("object-cover aspect-square rounded", {
                            "opacity-40": isSelected,
                          })}
                        />
                      ) : (
                        <div className="rounded h-full bg-accent flex items-center justify-center select-none">
                          <PiFile />
                        </div>
                      )}
                      {isSelected && (
                        <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow">
                          <PiCheckBold className="size-2.5" />
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
          </div>
          <div className="mt-6">
            <Pagination
              current={page}
              onPageChange={setPage}
              pages={Math.ceil((list?.total ?? 0) / 24)}
            />
          </div>
        </div>

        <UploadField
          folder={folder}
          onUpload={(mediaId) =>
            setSelection(multiple ? R.append(mediaId) : R.always([mediaId]))
          }
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t">
        <DialogClose asChild>
          <Button variant="ghost">{translate("common.cancel")}</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={() => onSelect(multiple ? selection : selection[0])}>
            {translate("components.media_field.select_media")}
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}

function UploadField({
  onUpload,
  folder,
}: {
  folder: string | null;
  onUpload(mediaId: string): void;
}) {
  const contentType = useContentType(ITEM_RESOURCE_ID);
  const translate = useTranslate();
  const { mutateAsync, isLoading } = useCreate({
    resource: ITEM_RESOURCE_ID,
  });
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for await (const f of acceptedFiles) {
        const { data } = await mutateAsync({
          values: {
            folder,
            name: f.name,
            file: f,
            type: f.type.split("/")[0],
          },
          meta: {
            contentType,
          },
        });
        onUpload(data.id as string);
      }
    },
    [mutateAsync],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-[320px] shrink-0 flex-none rounded-md border-2 border-transparent flex items-center justify-center hover:cursor-pointer",
        isDragActive
          ? "bg-indigo-50 text-indigo-500 border-dashed border-indigo-300"
          : "bg-muted text-muted-foreground",
      )}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <Spinner />
      ) : (
        <span className="select-none text-sm font-medium">
          {translate("components.media_field.upload.label")}
        </span>
      )}
    </div>
  );
}

export { MediaField };
