import { AppShell as BaseAppShell, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import * as React from "react";

import AppHeader from "@/components/app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <BaseAppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppHeader menuOpened={opened} toggleMenu={toggle} />
      <BaseAppShell.Navbar p="md">
        <BaseAppShell.Section>Navbar header</BaseAppShell.Section>
        <BaseAppShell.Section
          grow
          component={ScrollArea}
        ></BaseAppShell.Section>
        <BaseAppShell.Section>
          Navbar footer – always at the bottom
        </BaseAppShell.Section>
      </BaseAppShell.Navbar>
      <BaseAppShell.Main>{children}</BaseAppShell.Main>
    </BaseAppShell>
  );
}
