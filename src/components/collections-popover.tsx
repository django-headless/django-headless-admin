import { Popover, Title } from "@mantine/core";
import * as React from "react";
import { useState } from "react";

import useContentTypes from "@/hooks/useContentTypes.ts";

export function CollectionsPopover({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      position="right-start"
      offset={16}
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        {React.cloneElement(children, {
          isActive: opened,
          onClick: () => setOpened(!opened),
        })}
      </Popover.Target>
      <Popover.Dropdown>
        <PopoverContent />
      </Popover.Dropdown>
    </Popover>
  );
}

function PopoverContent() {
  const { data } = useContentTypes();

  console.log(data);

  return (
    <div>
      <Title order={4}></Title>
    </div>
  );
}
