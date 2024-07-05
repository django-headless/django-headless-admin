import { Combobox, useCombobox } from "@mantine/core";
import { useTranslate } from "@refinedev/core";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NON_COLLECTION_MODELS } from "@/constants";
import useContentTypes from "@/hooks/useContentTypes";
import { ContentType } from "@/types";

export function CollectionsPopover({
  children,
}: {
  children: React.ReactElement;
}) {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    opened,
  });
  const translate = useTranslate();
  const navigate = useNavigate();

  useEffect(() => {
    combobox.selectFirstOption();
  }, [search]);

  return (
    <Combobox
      position="right-start"
      offset={16}
      store={combobox}
      shadow="sm"
      onClose={() => {
        setOpened(false);
        combobox.focusTarget();
        combobox.resetSelectedOption();
      }}
      onOptionSubmit={(value) => {
        navigate(`/collections/${value}`);
        setOpened(false);
      }}
      width={320}
    >
      <Combobox.Target>
        {React.cloneElement(children, {
          isActive: opened,
          onClick: () => {
            setOpened(true);
            combobox.focusSearchInput();
          },
        })}
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Search
          onChange={(e) => setSearch(e.target.value)}
          placeholder={translate("components.collections-popover.search")}
        />
        <CollectionGroups search={search} />
      </Combobox.Dropdown>
    </Combobox>
  );
}

function CollectionGroups({ search }: { search: string }) {
  const translate = useTranslate();
  const { data } = useContentTypes();

  const groups = useMemo(
    () =>
      R.pipe(
        Object.values,
        R.reject(
          R.anyPass([
            // Singletons are shown in the "Components" menu.
            R.prop("isSingleton"),
            // Users are a separate route.
            R.prop("isUserModel"),
            // Some other special models are excluded from this list.
            R.propSatisfies(
              R.includes(R.__, NON_COLLECTION_MODELS),
              "appLabel",
            ),
            R.propSatisfies(
              (name: string) =>
                !name.toLowerCase?.().includes(search.toLowerCase().trim()),
              "verboseNamePlural",
            ),
          ]),
        ),
        R.groupBy(R.prop("appVerboseName")),
        Object.entries,
        // Show all single model apps first
        R.sortBy(([_, items]) => items.length > 1),
      )(data?.data ?? {}),
    [data?.data, search],
  ) as [string, ContentType[]][];

  return R.isEmpty(groups) ? (
    <Combobox.Empty>{translate("components.combobox.empty")}</Combobox.Empty>
  ) : (
    groups.map(([appVerboseName, entries]) => (
      <Combobox.Group
        key={appVerboseName}
        label={entries.length > 1 ? appVerboseName : undefined}
      >
        {entries.map((entry) => (
          <Combobox.Option key={entry.apiId} value={entry.apiId}>
            {entry.verboseNamePlural}
          </Combobox.Option>
        ))}
      </Combobox.Group>
    ))
  );
}
