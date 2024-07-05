import { useTranslate } from "@refinedev/core";
import keyboardJS from "keyboardjs";
import * as R from "ramda";
import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { PiHouseBold, PiImagesBold, PiUserBold } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useEffectOnce } from "react-use";

import { Input } from "@/components/ui/input";
import { modKey } from "@/components/ui/mod-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NON_COLLECTION_MODELS } from "@/constants";
import useAdminSite from "@/hooks/useAdminSite";
import useContentTypes from "@/hooks/useContentTypes";
import type { ContentType } from "@/types";
import { cn } from "@/utils/cn";

export function AppNavbar() {
  const translate = useTranslate();
  const { data } = useContentTypes();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: admin } = useAdminSite();

  // Enable keyboard shortcut for focusing search field
  useEffectOnce(() => {
    keyboardJS.bind("mod+j", (e) => {
      e?.preventDefault();
      searchInputRef.current?.focus();
    });

    return () => keyboardJS.unbind("mod+k");
  });

  const groups = useMemo(
    () =>
      R.pipe(
        Object.values,
        R.reject(
          R.anyPass([
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
      )(data?.data ?? {}),
    [data?.data, search],
  ) as [string, ContentType[]][];

  return (
    <nav className="flex flex-col overflow-hidden h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="space-y-1 border-b p-3">
          <div className="font-bold text-lg pl-3 pb-3">
            {admin?.data?.siteHeader}
          </div>
          <MainLink
            icon={<PiHouseBold />}
            label={translate("app.navbar.items.dashboard")}
            to=""
          />
          <MainLink
            icon={<PiImagesBold />}
            label={translate("app.navbar.items.media_library")}
            to="/media-library"
          />
        </div>

        <Input
          ref={searchInputRef}
          className="rounded-none border-t-0 border-x-0 focus-visible:ring-0 shrink-0 h-10 shadow-none"
          placeholder={`${translate("app.navbar.search")} ${modKey()}J`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="flex-1 p-3">
          <div className="mb-6">
            {groups
              .filter(([_, group]) => group.length === 1)
              .map(([_, group]) => group)
              .flatMap((group, idx) => (
                <div key={idx}>
                  {group.map((ct) => (
                    <MainLink
                      key={ct.apiId}
                      label={ct.verboseNamePlural}
                      to={`/content/${ct.apiId}`}
                    />
                  ))}
                </div>
              ))}
          </div>
          {groups
            .filter(([_, group]) => group.length > 1)
            .map(([appName, group]) => (
              <div key={appName} className="mb-6">
                {group.length > 1 && (
                  <h3 className="text-lg font-semibold tracking-tight pl-3 mb-2">
                    {appName}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.map((ct) => (
                    <MainLink
                      key={ct.apiId}
                      label={ct.verboseNamePlural}
                      to={`/content/${ct.apiId}`}
                    />
                  ))}
                </div>
              </div>
            ))}
        </ScrollArea>

        <div className="space-y-1 border-t p-3">
          <MainLink
            icon={<PiUserBold />}
            label={translate("app.navbar.items.users")}
            to="/users"
          />
          <MainLink
            icon={<FiSettings />}
            label={translate("app.navbar.items.settings")}
            to="/settings"
          />
        </div>
      </div>
    </nav>
  );
}

function MainLink({
  label,
  icon,
  to,
}: {
  label: string;
  icon?: React.ReactNode;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 w-full text-secondary-foreground text-sm font-medium rounded hover:bg-secondary flex items-center gap-3",
          {
            "bg-secondary": isActive,
          },
        )
      }
    >
      {icon && <div className="text-lg">{icon}</div>}
      <div className="w-full truncate">{label}</div>
    </NavLink>
  );
}
