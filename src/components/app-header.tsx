import { useGetIdentity, useLogout, useTranslate } from "@refinedev/core";
import { PiEyeBold, PiSignOutBold } from "react-icons/pi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAdminSite from "@/hooks/useAdminSite";
import { SessionUser } from "@/types";

export default function AppHeader() {
  const translate = useTranslate();
  const { data: admin } = useAdminSite();
  const { data: user } = useGetIdentity<SessionUser>();
  const { mutate: logout } = useLogout();

  return (
    <header className="flex items-center justify-between h-10 border-b px-4">
      <div className="font-bold text-sm">{admin?.data?.siteHeader}</div>
      <div className="h-full px-4 flex items-center gap-1">
        {admin?.data.siteUrl && (
          <Tooltip>
            <TooltipContent>
              {translate("app.header.view_website")}
            </TooltipContent>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(admin.data.siteUrl)}
              >
                <PiEyeBold />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        )}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="size-7">
                  {user.profilePicture && (
                    <AvatarImage src={user.profilePicture} />
                  )}
                  <AvatarFallback>{`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{`${user.firstName ?? ""} ${user.lastName ?? ""}`}</DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <PiSignOutBold className="mr-3" />
                  <span>{translate("app.header.log_out")}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Skeleton className="h-2 w-[200px]" />
        )}
      </div>
    </header>
  );
}
