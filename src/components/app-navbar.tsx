import { useGetIdentity, useLogout, useTranslate } from "@refinedev/core";
import keyboardJS from "keyboardjs";
import * as R from "ramda";
import * as React from "react";
import { useMemo, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { PiCaretDown } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useEffectOnce } from "react-use";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { NON_COLLECTION_MODELS } from "@/constants";
import useAdminSite from "@/hooks/useAdminSite";
import useContentTypes from "@/hooks/useContentTypes";
import { type ContentType, SessionUser } from "@/types";
import { cn } from "@/utils/cn";

export function AppNavbar() {
  const translate = useTranslate();
  const { data } = useContentTypes();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: admin } = useAdminSite();
  const { data: user } = useGetIdentity<SessionUser>();
  const { mutate: logout } = useLogout();

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
            // Don't show content types without admin models
            R.propSatisfies(R.isNil, "admin"),
            // Users and user groups are a separate route.
            R.prop("isUserModel"),
            R.whereEq({ resourceId: "groups" }),
            // Some other special models are excluded from this list.
            R.propSatisfies(
              R.includes(R.__, NON_COLLECTION_MODELS),
              "appLabel",
            ),
          ]),
        ),
        R.groupBy(R.prop("appVerboseName")),
        Object.entries,
      )(data?.data ?? {}),
    [data?.data],
  ) as [string, ContentType[]][];

  return (
    <nav className="flex flex-col overflow-hidden h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="space-y-1 border-b p-3">
          <div className="font-bold text-lg pl-6 pb-3">
            {admin?.data?.siteHeader}
          </div>
          <MainLink
            icon={<span>🏠</span>}
            label={translate("app.navbar.items.dashboard")}
            to=""
          />
          <MainLink
            icon={<span>📷</span>}
            label={translate("app.navbar.items.media_library")}
            to="/media-library"
          />
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="my-3">
            <h3 className="font-semibold text-secondary-foreground tracking-tight pl-6 mb-2">
              {translate("common.general")}
            </h3>
            {groups
              .filter(([_, group]) => group.length === 1)
              .map(([_, group]) => group)
              .flatMap((group, idx) => (
                <div key={idx}>
                  {group.map((ct) => (
                    <MainLink
                      key={ct.resourceId}
                      label={ct.verboseNamePlural}
                      to={`/content/${ct.resourceId}${ct.isSingleton ? "/edit" : ""}`}
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
                  <h3 className="font-semibold text-secondary-foreground tracking-tight pl-6 mb-2">
                    {appName}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.map((ct) => (
                    <MainLink
                      key={ct.resourceId}
                      label={ct.verboseNamePlural}
                      to={`/content/${ct.resourceId}${ct.isSingleton ? "/edit" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ))}
        </ScrollArea>

        <div className="flex justify-between items-center border-t p-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-1">
                  <Avatar className="size-8 mr-2">
                    {user.profilePicture && (
                      <AvatarImage src={user.profilePicture} />
                    )}
                    <AvatarFallback>{`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`}</AvatarFallback>
                  </Avatar>
                  <PiCaretDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-64">
                <div className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="size-12">
                    {user.profilePicture && (
                      <AvatarImage src={user.profilePicture} />
                    )}
                    <AvatarFallback>{`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{`${user.firstName ?? ""} ${user.lastName ?? ""}`}</div>
                    <div className="font-normal text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => logout()}>
                    {translate("app.header.log_out")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Skeleton className="h-2 w-[200px]" />
          )}
          <MainLink icon={<FiSettings />} to="/settings" />
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
  label?: string;
  icon?: React.ReactNode;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-6 py-2 text-sm font-normal rounded hover:bg-secondary flex items-center gap-3",
          isActive
            ? "font-medium bg-secondary text-secondary-foreground"
            : "text-muted-foreground",
        )
      }
    >
      {icon && <div className="text-lg">{icon}</div>}
      {label && <div className="w-full truncate">{label}</div>}
    </NavLink>
  );
}
