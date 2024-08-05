import { useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Outlet } from "react-router-dom";

import AppHeader from "@/components/app-header";
import { AppNavbar } from "@/components/app-navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_NAV_SIZE = 15;

export function AppShell() {
  const ref = useRef<ImperativePanelHandle>(null);

  return (
    <div className="h-dvh">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={DEFAULT_NAV_SIZE}
          minSize={5}
          maxSize={25}
          ref={ref}
        >
          <AppNavbar />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          onDoubleClick={() => {
            ref.current?.resize(DEFAULT_NAV_SIZE);
          }}
        />
        <ResizablePanel className="flex-1 flex flex-col bg-accent">
          <AppHeader />
          <ScrollArea className="flex-1">
            <Outlet />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
