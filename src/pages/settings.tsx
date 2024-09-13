import { useTranslate } from "@refinedev/core";
import * as React from "react";
import { PiCaretLeft } from "react-icons/pi";
import { Link, NavLink, Outlet } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export function SettingsPage() {
  const translate = useTranslate();

  return (
    <div className="flex items-stretch min-h-dvh animate-in fade-in duration-500 zoom-in-95">
      <div className="p-4 md:py-8 md:pl-8 lg:py-16 lg:pl-16 flex-none shrink-0 w-[320px]">
        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-1",
            buttonVariants({ variant: "ghost" }),
          )}
        >
          <PiCaretLeft />
          <span>{translate("common.back")}</span>
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-6">
          {translate("pages.settings.title")}
        </h1>
        <ul className="space-y-2">
          <li>
            <SettingsLink
              icon={<span>👤</span>}
              to="/settings/users"
              label={translate("pages.settings.users.label")}
            />
          </li>
          <li>
            <SettingsLink
              icon={<span>👥</span>}
              to="/settings/groups"
              label={translate("pages.settings.groups.label")}
            />
          </li>
          <li>
            <SettingsLink
              icon={<span>🔑</span>}
              to="/settings/api-tokens"
              label={translate("pages.settings.api_tokens.label")}
            />
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function SettingsLink({
  label,
  icon,
  to,
}: {
  label?: string;
  icon?: React.ReactNode;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-4 py-2 text-sm font-medium rounded hover:bg-secondary flex items-center gap-3",
          isActive
            ? "font-medium bg-secondary text-secondary-foreground"
            : "text-secondary-foreground",
        )
      }
    >
      {icon && <div className="text-lg">{icon}</div>}
      {label && <div className="w-full truncate">{label}</div>}
    </NavLink>
  );
}
