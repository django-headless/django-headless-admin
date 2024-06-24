import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Skeleton,
} from "@mantine/core";
import { useGetIdentity, useLogout, useTranslate } from "@refinedev/core";
import { TbLogout } from "react-icons/tb";

import useAdminConfig from "@/hooks/useAdminConfig";
import { SessionUser } from "@/types";

export default function AppHeader({
  menuOpened,
  toggleMenu,
}: {
  menuOpened: boolean;
  toggleMenu: VoidFunction;
}) {
  const translate = useTranslate();
  const { title } = useAdminConfig();
  const { data } = useGetIdentity<SessionUser>();
  const { mutate: logout } = useLogout();

  console.log(data);

  return (
    <AppShell.Header className="flex items-center justify-between">
      <Group className="h-full px-4">
        <Burger
          opened={menuOpened}
          onClick={toggleMenu}
          hiddenFrom="sm"
          size="sm"
        />
        <div>{title}</div>
      </Group>
      <Group className="h-full px-4">
        {data ? (
          <Menu>
            <Menu.Target>
              <Button variant="white" color="black">
                <Group>
                  <Avatar src={data.profilePicture} alt="" size="sm" />
                  <span>{`${translate("app.header.welcome")}, ${data.firstName || data.email}`}</span>
                </Group>
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
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
      </Group>
    </AppShell.Header>
  );
}
