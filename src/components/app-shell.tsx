import { AppShell as BaseAppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import * as React from "react";

import AppHeader from "@/components/app-header";
import { AppNavbar } from "@/components/app-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <BaseAppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppHeader menuOpened={opened} toggleMenu={toggle} />
      <AppNavbar />
      <BaseAppShell.Main pl={120} pt={120}>
        {children}
      </BaseAppShell.Main>
    </BaseAppShell>
  );
}
