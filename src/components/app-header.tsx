import { useGetIdentity, useLogout, useTranslate } from "@refinedev/core";

import useAdminSite from "@/hooks/useAdminSite";
import { SessionUser } from "@/types";

export default function AppHeader() {
  const translate = useTranslate();
  const { data: admin } = useAdminSite();
  const { data: user } = useGetIdentity<SessionUser>();
  const { mutate: logout } = useLogout();

  return (
    <header className="flex items-center justify-between">
      <div className="h-full px-4">
        <Burger
          opened={menuOpened}
          onClick={toggleMenu}
          hiddenFrom="sm"
          size="sm"
        />
        <div>{admin?.data?.siteHeader}</div>
      </div>
      <div className="h-full px-4">
        {admin?.data.siteUrl && (
          <Tooltip
            label={translate("app.header.view_website")}
            position="bottom"
          >
            <ActionIcon
              size="lg"
              variant="subtle"
              onClick={() => window.open(admin.data.siteUrl)}
            >
              <TbEye />
            </ActionIcon>
          </Tooltip>
        )}
        {user ? (
          <Menu>
            <MenuTrigger>
              <Button variant="subtle">
                <Avatar src={user.profilePicture} alt="" size="sm" />
              </Button>
            </MenuTrigger>
            <Menu.Dropdown>
              <div className="p-3">
                <div className="text-sm font-semibold">{`${user.firstName ?? ""} ${user.lastName ?? ""}`}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <Menu.Divider />
              <Menu.Item
                onClick={logout}
                color="red"
                leftSection={<TbLogout />}
              >
                {translate("app.header.log_out")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Skeleton h={8} w={200} />
        )}
      </div>
    </header>
  );
}
