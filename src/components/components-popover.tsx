import { Combobox, useCombobox } from "@mantine/core";
import { useTranslate } from "@refinedev/core";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import useContentTypes from "@/hooks/useContentTypes";
import { ContentType } from "@/types";

export function ComponentsPopover({
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
          placeholder={translate("components.components-popover.search")}
        />
        <ComponentsGroups search={search} />
      </Combobox.Dropdown>
    </Combobox>
  );
}

function ComponentsGroups({ search }: { search: string }) {
  const translate = useTranslate();
  const { data } = useContentTypes();

  const groups = useMemo(
    () =>
      R.pipe(
        Object.values,
        R.filter(
          R.both(
            R.prop("isSingleton"),
            R.propSatisfies(
              (name: string) =>
                name.toLowerCase?.().includes(search.toLowerCase().trim()),
              "verboseNamePlural",
            ),
          ),
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
            {entry.verboseName}
          </Combobox.Option>
        ))}
      </Combobox.Group>
    ))
  );
}
