import { AppShell as BaseAppShell, ScrollArea, Tooltip } from "@mantine/core";
import { useTranslate } from "@refinedev/core";
import * as React from "react";
import { forwardRef } from "react";
import {
  TbComponents,
  TbDatabase,
  TbHome2,
  TbPhoto,
  TbSettings,
  TbUser,
} from "react-icons/tb";
import { NavLink } from "react-router-dom";

import { CollectionsPopover } from "@/components/collections-popover";
import cn from "@/utils/cn.ts";

export function AppNavbar() {
  const translate = useTranslate();

  return (
    <BaseAppShell.Navbar p="xs" w={60}>
      <BaseAppShell.Section grow component={ScrollArea}>
        <div className="space-y-3">
          <MainLink
            icon={<TbHome2 />}
            label={translate("app.navbar.items.dashboard")}
            to=""
          />
          <MainLink
            icon={<TbPhoto />}
            label={translate("app.navbar.items.media_library")}
            to="/media-library"
          />

          <CollectionsPopover>
            <MainItem
              icon={<TbDatabase />}
              label={translate("app.navbar.items.collections")}
            />
          </CollectionsPopover>
          <MainLink
            icon={<TbComponents />}
            label={translate("app.navbar.items.components")}
            to="/components"
          />
          <MainLink
            icon={<TbUser />}
            label={translate("app.navbar.items.users")}
            to="/users"
          />
          <MainLink
            icon={<TbSettings />}
            label={translate("app.navbar.items.settings")}
            to="/settings"
          />
        </div>
      </BaseAppShell.Section>
    </BaseAppShell.Navbar>
  );
}

function MainLink({
  label,
  icon,
  to,
}: {
  label: string;
  icon: React.ReactNode;
  to: string;
}) {
  return (
    <Tooltip
      label={label}
      position="right"
      transitionProps={{ duration: 0 }}
      key={label}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "px-1 py-2 w-full text-2xl text-gray-700 rounded-md hover:bg-gray-100 flex items-center justify-center",
            {
              "bg-primary-50 text-primary-600 hover:bg-primary-50": isActive,
            },
          )
        }
      >
        {icon}
      </NavLink>
    </Tooltip>
  );
}

const MainItem = forwardRef<
  HTMLDivElement,
  {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
  }
>(function MainItem({ icon, label, isActive, ...props }, ref) {
  return (
    <Tooltip
      label={label}
      position="right"
      transitionProps={{ duration: 0 }}
      key={label}
    >
      <div
        ref={ref}
        {...props}
        className={cn(
          "px-1 py-2 w-full text-2xl text-gray-700 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer",
          { "bg-primary-50 text-primary-600": isActive },
        )}
      >
        {icon}
      </div>
    </Tooltip>
  );
});
