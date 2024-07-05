import * as React from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "@/components/app-header";
import { AppNavbar } from "@/components/app-navbar";

export function AppShell() {
  return (
    <div>
      <AppNavbar />
      <div>
        <AppHeader />
        <main className="bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
